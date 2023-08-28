import { Button } from "@/components/ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { useStore } from "@/store/useStore";
import { useStarStore } from "@/store/star";
import { useAccountStore } from "@/store/account";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useKeyboardShortcut } from "@/lib/useKeyboardShortcut";

export default function Pagination() {
  const starStore = useStore(useStarStore, (state) => state)!;
  const accountStore = useStore(useAccountStore, (state) => state)!;

  useKeyboardShortcut(["arrowright"], () => {
    if (
      starStore.pagination.page ===
      Number(Math.ceil(starStore?.pagination?.total / 12))
    )
      return;

    starStore.setPagintion({
      page: starStore?.pagination?.page! + 1,
    });

    starStore.getStarFromIndexDB(accountStore.currentAccount?.login!);
  });

  useKeyboardShortcut(["arrowleft"], () => {
    if (starStore?.pagination?.page <= 1) return;

    starStore.setPagintion({
      page: starStore?.pagination?.page! - 1,
    });

    starStore.getStarFromIndexDB(accountStore.currentAccount?.login!);
  });

  return starStore?.pagination.total > 0 ? (
    <div className="w-full flex flex-wrap justify-between items-center">
      <div className="flex flex-wrap gap-3 mr-5">
        <span className="text-sm text-muted-foreground font-medium">
          Total: {starStore?.pagination?.total}
        </span>
      </div>
      <div className="flex flex-wrap gap-5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            Items per page
          </span>
          <Select
            value={`${starStore.pagination.size}`}
            onValueChange={(value) => {
              starStore.setPagintion({
                page: 1,
                size: Number(value),
              });

              starStore.getStarFromIndexDB(accountStore.currentAccount?.login!);
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue
                placeholder={
                  <span className="text-muted-foreground">
                    {starStore.pagination.size}
                  </span>
                }
              />
            </SelectTrigger>
            <SelectContent side="top">
              {[12, 24, 36, 48].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            disabled={starStore?.pagination?.page <= 1}
            className="h-8 w-8 p-0"
            variant="outline"
            size="icon"
            onClick={() => {
              starStore.setPagintion({
                page: 1,
              });

              starStore.getStarFromIndexDB(accountStore.currentAccount?.login!);
            }}
          >
            <DoubleArrowLeftIcon className="h-4 w-4"></DoubleArrowLeftIcon>
          </Button>
          <Button
            disabled={starStore?.pagination?.page <= 1}
            className="h-8 w-8 p-0"
            variant="outline"
            size="icon"
            onClick={() => {
              starStore.setPagintion({
                page: starStore?.pagination?.page! - 1,
              });

              starStore.getStarFromIndexDB(accountStore.currentAccount?.login!);
            }}
          >
            <ChevronLeftIcon className="h-4 w-4"></ChevronLeftIcon>
          </Button>
          <Button
            disabled={
              starStore.pagination.page ===
              Number(Math.ceil(starStore?.pagination?.total / 12))
            }
            onClick={() => {
              starStore.setPagintion({
                page: starStore?.pagination?.page! + 1,
              });

              starStore.getStarFromIndexDB(accountStore.currentAccount?.login!);
            }}
            className="h-8 w-8 p-0"
            variant="outline"
            size="icon"
          >
            <ChevronRightIcon className="h-4 w-4"></ChevronRightIcon>
          </Button>
          <Button
            disabled={
              starStore.pagination.page ===
              Number(Math.ceil(starStore?.pagination?.total / 12))
            }
            onClick={() => {
              starStore.setPagintion({
                page: Number(Math.ceil(starStore?.pagination?.total / 12)),
              });

              starStore.getStarFromIndexDB(accountStore.currentAccount?.login!);
            }}
            className="h-8 w-8 p-0"
            variant="outline"
            size="icon"
          >
            <DoubleArrowRightIcon className="h-4 w-4"></DoubleArrowRightIcon>
          </Button>
          <span className="text-sm font-medium text-muted-foreground">
            {starStore?.pagination?.page} /{" "}
            {Math.ceil(
              starStore?.pagination?.total / starStore.pagination.size
            )}
          </span>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}
