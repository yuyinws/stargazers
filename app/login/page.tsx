import { Button } from "@/components/ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import UserSearch from "@/components/user-search";

export default function Login() {
  return (
    <div className="w-full h-screen  flex justify-center">
      <div className="py-20 flex flex-col">
        <h1 className="text-3xl font-bold mb-5 px-10">Add account</h1>
        <Button variant="outline" className="flex gap-3">
          <GitHubLogoIcon className="h-[1.2rem] w-[1.2rem]"></GitHubLogoIcon>
          Continue with GitHub
        </Button>
        <div className="relative w-full my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-zinc-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or Search a user
            </span>
          </div>
        </div>
        <UserSearch></UserSearch>
      </div>
    </div>
  );
}
