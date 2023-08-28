"use client";

import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useStore, useSettingStore, useStarStore } from "@/store";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { subMonths, subYears } from "date-fns";
import { toast } from "sonner";

export default function Settings() {
  const settingStore = useStore(useSettingStore, (state) => state)!;
  const starStore = useStore(useStarStore, (state) => state)!;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Preferences</h3>
        <p className="text-sm text-muted-foreground">Manage preferences.</p>
      </div>
      <Separator />

      <div className="flex flex-row items-center justify-between rounded-lg border p-4">
        <div>
          <div className="text-base">Auto switch account</div>
          <div className="text-sm text-muted-foreground">
            Automatically switch to the new account after adding a new one.
          </div>
        </div>

        <Switch
          checked={settingStore?.settings.autoSwitch}
          onCheckedChange={(event) => {
            settingStore?.setSettings({
              autoSwitch: event,
            });
            toast.success("Setting updated");
          }}
        ></Switch>
      </div>

      <div className="flex flex-row items-center justify-between rounded-lg border p-4">
        <div>
          <div className="text-base">Date range</div>
          <div className="text-sm text-muted-foreground">
            Default time range for querying.
          </div>
        </div>

        <Select
          onValueChange={(event) => {
            settingStore?.setSettings({
              dateRange: event,
            });

            toast.success("Setting updated");
          }}
          value={settingStore?.settings.dateRange}
        >
          <SelectTrigger className="w-[22rem] xl:w-[10rem]">
            <SelectValue placeholder="Pick a date range"></SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="0">Last 3 months</SelectItem>
              <SelectItem value="1">Last 6 months</SelectItem>
              <SelectItem value="2">Last 1 year</SelectItem>
              <SelectItem value="3">Last 2 year</SelectItem>
              <SelectItem value="4">Last 5 year</SelectItem>
              <SelectItem value="5">Last 10 year</SelectItem>
              <SelectItem value="6">Last 20 year</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
