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

export default function Pagination() {
  const starStore = useStore(useStarStore, (state) => state)!;
  const accountStore = useStore(useAccountStore, (state) => state)!;

  return starStore?.pagination ? (
    <div className="w-full flex justify-end px-8 items-center">
      <div className="flex gap-3 mr-5">
        <span className="text-sm font-medium">
          Total: {starStore?.pagination?.total}
        </span>
        <span className="text-sm font-medium">
          Page {starStore?.pagination?.page} of{" "}
          {(starStore?.pagination?.total / 12).toFixed(0)}
        </span>
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
            Number((starStore?.pagination?.total / 12).toFixed(0))
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
            Number((starStore?.pagination?.total / 12).toFixed(0))
          }
          onClick={() => {
            starStore.setPagintion({
              page: Number((starStore?.pagination?.total / 12).toFixed(0)),
            });

            starStore.getStarFromIndexDB(accountStore.currentAccount?.login!);
          }}
          className="h-8 w-8 p-0"
          variant="outline"
          size="icon"
        >
          <DoubleArrowRightIcon className="h-4 w-4"></DoubleArrowRightIcon>
        </Button>
      </div>
    </div>
  ) : (
    ""
  );
}
