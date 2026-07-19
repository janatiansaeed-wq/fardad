import { cn } from "@fardad/utils";

interface HeadingProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
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
        align === "right" && "text-right",
        align === "left" && "text-left"
      )}
    >
      <h2 className="text-4xl font-bold text-primary">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
