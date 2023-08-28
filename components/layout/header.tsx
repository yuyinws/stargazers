import { ModeToggle } from "@/components/toggle-theme";
import styles from "@/styles/header.module.css";
import dynamic from "next/dynamic";
import Logo from "@/components/logo-icon";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const Account = dynamic(() => import("@/components/account"), {
    ssr: false,
  });

  return (
    <header
      className={`flex items-center justify-between sticky top-0 py-1 px-3 ${styles.header}`}
    >
      <Link href="/">
        <Image
          className="block dark:hidden"
          src="/logo-light.svg"
          alt="logo"
          width="24"
          height="24"
        ></Image>
        <Image
          className="hidden dark:block"
          src="/logo-dark.svg"
          alt="logo"
          width="24"
          height="24"
        ></Image>
      </Link>
      <div className="flex items-center">
        <ModeToggle></ModeToggle>
        <Account></Account>
      </div>
    </header>
  );
}
