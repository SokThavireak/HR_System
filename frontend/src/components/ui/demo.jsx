import { AppShell } from "@/components/ui/appshell";
import { Dashboard } from "@/components/ui/dashboard";

export default function AppShellDemo() {
  return (
    <AppShell currentPage={{ title: "Dashboard" }}>
      <Dashboard />
    </AppShell>
  );
}
