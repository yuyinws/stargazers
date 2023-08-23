import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="my-3 flex flex-col items-center justify-center text-sm leading-loose text-muted-foreground">
        <div className="flex gap-1">
          <span>Made by</span>
          <Link
            className="font-medium underline underline-offset-4"
            href="https://github.com/yuyinws"
            target="_blank"
          >
            yuyinws
          </Link>
        </div>
        <div>
          <Link
            className="font-medium underline underline-offset-4"
            href="https://github.com/yuyinws/stargazers"
            target="_blank"
          >
            GitHub source code
          </Link>
        </div>
      </div>
    </footer>
  );
}
