import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { ModeToggle } from "@/components/toggle-theme";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-between sticky top-0 py-1 px-3 border-b-[1px] border-zinc-200">
      <div>Stargazers</div>
      <div className="flex">
        <Link
          href="https://github.com"
          target="_blank"
          className={buttonVariants({ variant: "ghost" })}
        >
          <GitHubLogoIcon className="h-[1.2rem] w-[1.2rem]"></GitHubLogoIcon>
        </Link>

        {/* <Button variant="ghost" size="icon" className="focus:outline-none">
          <a href="https://github.com" target="_blank">
            <GitHubLogoIcon className="h-[1.2rem] w-[1.2rem]"></GitHubLogoIcon>
          </a>
        </Button> */}
        <ModeToggle></ModeToggle>
      </div>
    </header>
  );
}
