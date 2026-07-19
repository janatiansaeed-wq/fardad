import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function DashboardContent({ children }: Props) {
  return (
    <main className="flex-1 p-8">
      {children}
    </main>
  );
}