import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function DashboardContainer({ children }: Props) {
  return (
    <div className="min-h-screen bg-slate-100">
      {children}
    </div>
  );
}