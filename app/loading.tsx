import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-wrap sm:w-[22rem] lg:w-[46rem] xl:w-[70rem] 2xl:w-[94rem] m-auto gap-5">
      {Array(12)
        .fill(0)
        .map((_, index) => {
          return (
            <div key={index}>
              <div className="rounded-lg border bg-card text-card-foreground w-[22rem] h-[11rem]">
                <div className="px-5 py-3 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex gap-2">
                      <Skeleton className="h-[1.5rem] w-[1.5rem] rounded-full"></Skeleton>
                      <Skeleton className="h-[1.3rem] flex-1"></Skeleton>
                    </div>
                    <Skeleton className="h-[1.3rem] flex-1 mt-2"></Skeleton>
                    <Skeleton className="h-[5rem] flex-1 mt-2"></Skeleton>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
