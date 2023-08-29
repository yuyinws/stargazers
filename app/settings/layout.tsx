import { Metadata } from "next";
import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/components/ui/sidebar-nav";

export const metadata: Metadata = {
  title: "Settings",
  description: "Stargazers settings page",
};

const sidebarNavItems = [
  {
    title: "Account",
    href: "/settings",
  },
  {
    title: "Preferences",
    href: "/settings/preferences",
  },
  {
    title: "IndexedDB",
    href: "/settings/indexdb",
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <>
      <div className="p-10 xl:px-40 xl:py-10 pb-0">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">Manage your app settings.</p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl min-h-screen">{children}</div>
        </div>
      </div>
    </>
  );
}
