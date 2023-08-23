import { useStarStore } from "@/store/star";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import styles from "@/styles/repo.module.css";
import { StarIcon } from "@radix-ui/react-icons";
import { GitForkIcon, HomeIcon } from "lucide-react";
import { FadeInWhenVisible } from "./motion";
import Link from "next/link";
import { emojify } from "node-emoji";
import { Skeleton } from "@/components/ui/skeleton";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export default function RepoList() {
  const { stars } = useStarStore((state) => state);

  return (
    <div className="flex flex-wrap gap-x-8 gap-y-3">
      {stars.length > 0 ? (
        stars.map((star) => {
          return (
            <FadeInWhenVisible key={star.id}>
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-[22rem] h-[11rem] hover:shadow-lg">
                <div className="px-5 py-3 h-full flex flex-col justify-between">
                  <div className="flex flex-col gap-1">
                    <Link
                      href={`https://github.com/${star.owner}`}
                      target="_blank"
                      className="flex items-center gap-2"
                    >
                      <Avatar
                        className={cn("h-[1.3rem] w-[1.3rem] cursor-pointer")}
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
                      href={`https://github.com/${star.owner}/${star.repo}`}
                      target="_blank"
                      className="flex gap-2 flex-wrap"
                    >
                      <div
                        className={`text-base font-semibold ${styles["repo-name"]}`}
                      >
                        {star.repo}
                      </div>
                      {star.isTemplate ? (
                        <div className="inline-flex items-center rounded-full border px-2.5 text-xs font-semibold transition-colors text-muted-foreground">
                          Template
                        </div>
                      ) : null}

                      {star.isArchived ? (
                        <div className="inline-flex items-center rounded-full border px-2.5 text-xs font-semibold text-muted-foreground border-yellow-500 text-yellow-500">
                          Archive
                        </div>
                      ) : null}
                    </Link>
                    <div
                      className={`text-sm text-muted-foreground ${styles.description}`}
                    >
                      {emojify(star?.description || "")}
                    </div>
                  </div>
                  <div className="flex flex-col">
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
                      <Link
                        href={`https://github.com/${star.owner}/${star.repo}/stargazers`}
                        target="_blank"
                      >
                        <div className="flex items-center gap-1">
                          <StarIcon className="text-muted-foreground w-[1rem] h-[1rem]"></StarIcon>
                          <span className="text-sm text-muted-foreground">
                            {star.stargazerCount.toLocaleString()}
                          </span>
                        </div>
                      </Link>
                      <Link
                        href={`https://github.com/${star.owner}/${star.repo}/forks`}
                        target="_blank"
                      >
                        <div className="flex items-center gap-1">
                          <GitForkIcon className="text-muted-foreground w-[1rem] h-[1rem]"></GitForkIcon>
                          <span className="text-sm text-muted-foreground">
                            {star.forkCount.toLocaleString()}
                          </span>
                        </div>
                      </Link>
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
                    <div>
                      {/* <div className="text-sm text-muted-foreground">
                        Updated {dayjs(star.updatedAt).fromNow()}
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </FadeInWhenVisible>
          );
        })
      ) : (
        <div className="flex justify-center items-center h-[20rem] rounded-sm border bg-card text-card-foreground w-full">
          <div className="text-muted-foreground text-sm">No Results Found</div>
        </div>
      )}
    </div>
  );
}
