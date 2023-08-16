// import useSWR, { mutate } from "swr";
import Loading from "@/app/loading";
import { useStarStore } from "@/store/star";
import { useEffect } from "react";
import Balancer from "react-wrap-balancer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import styles from "@/styles/repo.module.css";
import { StarIcon } from "@radix-ui/react-icons";
import { GitForkIcon, HomeIcon } from "lucide-react";
import { FadeInWhenVisible } from "./motion";
import Link from "next/link";

export default function RepoList() {
  const { fetchStars, stars, loading } = useStarStore((state) => state);

  useEffect(() => {
    fetchStars();
  }, []);

  if (loading) {
    return <Loading></Loading>;
  } else {
    return (
      <div className="flex flex-wrap gap-5">
        {stars.map((star) => {
          return (
            <>
              <FadeInWhenVisible>
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm sm:w-[20rem] sm:h-[10rem] xl:w-[28rem] xl:h-[16rem]  hover:shadow-lg">
                  <div className="p-5 h-full flex flex-col justify-between gap-2">
                    <div className="flex justify-between">
                      <div>
                        <div
                          className={`mb-3 text-xl max-w-[17rem] font-semibold ${styles["repo-name"]}`}
                        >
                          {star.owner}/{star.repo}
                        </div>
                        <div
                          className={`w-[12rem] text-sm text-muted-foreground ${styles.description}`}
                        >
                          {star.description}
                        </div>
                      </div>
                      <Link
                        href={`https://github.com/${star.owner}`}
                        target="_blank"
                      >
                        <Avatar
                          className={cn(
                            "h-[4rem] w-[4rem] ml-2 cursor-pointer"
                          )}
                        >
                          <AvatarImage src={star.ownerAvatarUrl} />
                          <AvatarFallback>{star.repo}</AvatarFallback>
                        </Avatar>
                      </Link>
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

                      {/* {star.license ? (
                      <div className="flex items-center gap-1">
                        <ScaleIcon className="text-muted-foreground w-[1rem] h-[1rem]"></ScaleIcon>
                        <span className="text-sm text-muted-foreground">
                          {star.license}
                        </span>
                      </div>
                    ) : null} */}
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
                          <span className="text-sm">Home page</span>
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </div>
              </FadeInWhenVisible>
            </>
          );
        })}
      </div>
    );
    // <>
    //   <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-[24rem] h-[12rem] hover:shadow-lg">
    //     <div className="p-5">
    //       <div className="flex justify-between">
    //         <div>
    //           <div className="mb-3 text-2xl font-semibold leading-none tracking-tight">
    //             vuejs/vue
    //           </div>
    //           <Balancer className="w-[12rem] text-sm text-muted-foreground">
    //             Card Description Card Description Card Description
    //           </Balancer>
    //         </div>
    //         <Avatar className={cn("h-[4rem] w-[4rem] ml-2 cursor-pointer")}>
    //           <AvatarImage src="" />
    //           <AvatarFallback>S</AvatarFallback>
    //         </Avatar>
    //       </div>
    //     </div>
    //   </div>
    // </>
  }
}
