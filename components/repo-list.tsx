import Loading from "@/app/loading";
import { useStarStore } from "@/store/star";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import styles from "@/styles/repo.module.css";
import { StarIcon } from "@radix-ui/react-icons";
import { GitForkIcon, HomeIcon } from "lucide-react";
import { FadeInWhenVisible } from "./motion";
import Link from "next/link";
import { initDb, getAllAccount } from "@/lib/db";
import { useAccountStore } from "@/store/account";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function RepoList() {
  const { getStarFromIndexDB, stars, loading, fetchStars } = useStarStore(
    (state) => state
  );
  const { setAllAccount, setCurrentAccount, refreshAllAccount } =
    useAccountStore();
  const router = useRouter();
  async function getAccount() {
    const db = await initDb();
    const accounts = await getAllAccount(db);
    if (accounts?.length > 0) {
      setAllAccount(accounts);
      const currentAccount = accounts[0];
      setCurrentAccount(currentAccount);
      if (!currentAccount.lastSyncAt) {
        await fetchStars(currentAccount.login);
        refreshAllAccount();
      } else {
        await getStarFromIndexDB(currentAccount.login);
      }
    } else {
      router.replace("/login");
    }
  }

  useEffect(() => {
    getAccount();
  }, []);

  if (loading) {
    return <Loading></Loading>;
  } else {
    return (
      <div>
        <div className="sm:w-[22rem] lg:w-[46rem] xl:w-[70rem] 2xl:w-[94rem] m-auto">
          <div className="flex flex-wrap gap-5">
            {stars.map((star) => {
              return (
                <FadeInWhenVisible key={star.id}>
                  <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-[22rem] h-[11rem]  hover:shadow-lg">
                    <div className="px-5 py-3 h-full flex flex-col justify-between">
                      <div className="flex flex-col gap-1">
                        <Link
                          href={`https://github.com/${star.owner}`}
                          target="_blank"
                          className="flex items-center gap-2"
                        >
                          <Avatar
                            className={cn(
                              "h-[1.3rem] w-[1.3rem] cursor-pointer"
                            )}
                          >
                            <AvatarImage src={star.ownerAvatarUrl} />
                            <AvatarFallback>
                              <Skeleton className="h-[1.5rem] w-[1.5rem] rounded-full"></Skeleton>
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-muted-foreground text-base">
                            {star.owner}
                          </div>
                        </Link>
                        <Link
                          href={`https://github.com${star.owner}/${star.repo}`}
                        >
                          <div
                            className={`text-base font-semibold ${styles["repo-name"]}`}
                          >
                            {star.repo}
                          </div>
                        </Link>
                        <div
                          className={`text-sm text-muted-foreground ${styles.description}`}
                        >
                          {star.description}
                        </div>
                      </div>
                      <div className="flex items-center flex-wrap gap-x-3">
                        {star.language ? (
                          <div className="flex items-center gap-1">
                            <div
                              className={`w-2 h-2 rounded-[50%]`}
                              style={{ backgroundColor: star.languageColor }}
                            ></div>
                            <div className="text-sm text-muted-foreground">
                              {star.language}
                            </div>
                          </div>
                        ) : null}
                        <div className="flex items-center gap-1">
                          <StarIcon className="text-muted-foreground w-[1rem] h-[1rem]"></StarIcon>
                          <span className="text-sm text-muted-foreground">
                            {star.stargazerCount.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <GitForkIcon className="text-muted-foreground w-[1rem] h-[1rem]"></GitForkIcon>
                          <span className="text-sm text-muted-foreground">
                            {star.forkCount.toLocaleString()}
                          </span>
                        </div>
                        {star?.homepageUrl ? (
                          <Link
                            className="flex items-center gap-1 text-muted-foreground"
                            href={star.homepageUrl}
                            target="_blank"
                          >
                            <HomeIcon className="w-[1rem] h-[1rem]"></HomeIcon>
                            <span className="text-sm">Home</span>
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </FadeInWhenVisible>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
