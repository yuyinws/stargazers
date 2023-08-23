import { ModeToggle } from "@/components/toggle-theme";
import styles from "@/styles/header.module.css";
import dynamic from "next/dynamic";
import Logo from "@/components/logo";

export default function Header() {
  const Account = dynamic(() => import("@/components/account"), {
    ssr: false,
  });

  return (
    <header
      className={`flex items-center justify-between sticky top-0 py-1 px-3 border-b-[1px] border-zinc-200 ${styles.header}`}
    >
      <Logo></Logo>
      <div className="flex items-center">
        <ModeToggle></ModeToggle>
        <Account></Account>
      </div>
    </header>
  );
}
