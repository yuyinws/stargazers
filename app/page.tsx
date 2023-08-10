import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/toggle-theme";

export default function Home() {
  return (
    <div>
      <ModeToggle></ModeToggle>
      <Button className="ml-5">Click Me</Button>
    </div>
  );
}
