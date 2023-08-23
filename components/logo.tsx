"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

function logo() {
  return <div className="cursor-default">Stargazers</div>;
}

export default function Logo() {
  const pathname = usePathname();

  const [_pathname, setPathname] = useState(pathname);

  useEffect(() => {
    setPathname(pathname);
  }, [pathname]);

  return <>{_pathname === "/" ? logo() : <Link href="/">{logo()}</Link>}</>;
}
