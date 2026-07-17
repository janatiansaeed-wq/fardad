import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function Section({
  children,
}: Props) {
  return (
    <section className="rounded-xl bg-white p-6 shadow-sm">
      {children}
    </section>
  );
}