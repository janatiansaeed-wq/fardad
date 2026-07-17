import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function Grid({
  children,
}: Props) {
  return (
    <div className="grid gap-6 lg:grid-cols-4">
      {children}
    </div>
  );
}