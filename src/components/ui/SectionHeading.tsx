import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export default function SectionHeading({
  title,
  subtitle,
  centered = true,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn(centered && "text-center", className)}>
      <h2 className="text-4xl md:text-5xl font-display text-text-primary mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
