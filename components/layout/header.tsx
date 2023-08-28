import { ModeToggle } from "@/components/toggle-theme";
import styles from "@/styles/header.module.css";
import dynamic from "next/dynamic";
import Logo from "@/components/logo-icon";
import Link from "next/link";

export default function Header() {
  const Account = dynamic(() => import("@/components/account"), {
    ssr: false,
  });

  return (
    <header
      className={`flex items-center justify-between sticky top-0 py-1 px-3 ${styles.header}`}
    >
      <Link href="/">
        <Logo></Logo>
      </Link>
      <div className="flex items-center">
        <ModeToggle></ModeToggle>
        <Account></Account>
      </div>
    </header>
  );
}
