"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "@/components/logo-icon";

function logo() {
  return (
    <div className="cursor-pointer flex items-center gap-2">
      <Icon></Icon>
      {/* <div className="font-semibold">Stargazers</div> */}
    </div>
  );
}

export default function Logo() {
  const pathname = usePathname();

  const [_pathname, setPathname] = useState(pathname);

  useEffect(() => {
    setPathname(pathname);
  }, [pathname]);

  return (
    <>
      {["/", "/login"].includes(_pathname) ? (
        logo()
      ) : (
        <Link href="/">{logo()}</Link>
      )}
    </>
  );
}
