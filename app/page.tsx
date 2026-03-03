import { TimeKeeper } from "./components/TimeKeeper";
import { ThemeToggle } from "./components/ThemeToggle";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <ThemeToggle />
      <TimeKeeper />
    </main>
  );
}
