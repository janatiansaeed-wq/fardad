import NextImage, { ImageProps } from "next/image";
import { cn } from "@fardad/utils";

interface Props extends ImageProps {
  className?: string;
}

export default function Image({
  className,
  alt,
  ...props
}: Props) {
  return (
    <NextImage
      {...props}
      alt={alt}
      className={cn(
        "object-cover select-none",
        className
      )}
    />
  );
}
