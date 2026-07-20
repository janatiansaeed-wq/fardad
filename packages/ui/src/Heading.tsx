import { cn } from "@fardad/utils";

interface HeadingProps {
  title: string;
  subtitle?: string;
  align?: "start" | "center" | "end";
}

export default function Heading({
  title,
  subtitle,
  align = "center",
}: HeadingProps) {
  return (
    <div
      className={cn(
        "mb-12",
        align === "center" && "text-center",
        align === "start" && "text-start",
        align === "end" && "text-end"
      )}
    >
      <h2 className="text-4xl font-bold text-[var(--ui-color-primary,#1f2937)]">
        {title}
      </h2>

      {subtitle && (
        <p className="mx-auto mt-4 max-w-3xl text-lg text-[var(--ui-color-muted-text,#4b5563)]">
          {subtitle}
        </p>
      )}
    </div>
  );
}
