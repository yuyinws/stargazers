"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";
import { useStore, useAccountStore } from "@/store";
import { useRouter } from "next/navigation";
import { initDb } from "@/lib/db";
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
import { Button } from "@/components/ui/button";
import { Trash2Icon, Loader2Icon } from "lucide-react";
import { deleteDB } from "idb";

export default function Settings() {
  const accountStore = useStore(useAccountStore, (state) => state);
  const router = useRouter();

  const [count, setCount] = useState({
    account: 0,
    star: 0,
  });
  const [deleteDBLoading, setDeleteDBLoading] = useState(false);

  async function getDBTableCount() {
    try {
      const db = await initDb();
      const starCount = await db.count("stars");
      const accountCount = await db.count("accounts");

      setCount({
        account: accountCount,
        star: starCount,
      });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (accountStore?.allAccount?.length === 0) router.replace("/login");
    else getDBTableCount();
  });
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">IndexDB</h3>
        <p className="text-sm text-muted-foreground">Manage IndexDB</p>
      </div>

      <div>
        <h3 className="text-lg font-medium">Usage</h3>
        <Table>
          {/* <TableCaption>current tables and amount</TableCaption> */}
          <TableHeader>
            <TableRow>
              <TableHead>Table</TableHead>
              <TableHead>Total entries</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>accounts</TableCell>
              <TableCell>{count.account}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>stars</TableCell>
              <TableCell>{count.star}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div>
        <h3 className="text-lg font-medium">Delete</h3>
        <p className="text-sm text-muted-foreground mb-3">
          {" "}
          If you encounter some unexpected errors, you can try deleting IndexDB.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button disabled={deleteDBLoading} size="sm" variant="destructive">
              {deleteDBLoading ? (
                <>
                  <Loader2Icon className="h-[1rem] w-[1rem] animate-spin"></Loader2Icon>
                  <span className={["ml-1"].join(" ")}>Deleting ...</span>
                </>
              ) : (
                <>
                  <Trash2Icon className="h-[1rem] w-[1rem]"></Trash2Icon>
                  <span className={["ml-1"].join(" ")}>Delete DB</span>
                </>
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                IndexDB.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  try {
                    setDeleteDBLoading(true);
                    await deleteDB("Stargazers");
                    accountStore?.setAllAccount([]);
                    accountStore?.setCurrentAccount(null);
                    router.replace("/login");
                    toast.success("DB deleted");
                  } catch (error) {
                    toast.error("Error deleting DB", {
                      description: String(error),
                    });
                  } finally {
                    setDeleteDBLoading(false);
                  }
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
