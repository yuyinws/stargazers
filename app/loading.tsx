import { Skeleton } from "@/components/ui/skeleton";
import { Loader2Icon } from "lucide-react";

export default function Loading() {
  // create a full screen mask loading
  return (
    <>
      <div className="w-screen h-screen flex justify-center items-center fixed inset-0 bg-gray-300 bg-opacity-50 z-50">
        <Loader2Icon className="text-gray-500 h-[3rem] w-[3rem] animate-spin"></Loader2Icon>
      </div>
      <div className="h-screen"></div>
    </>
  );
}
