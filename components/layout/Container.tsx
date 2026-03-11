"use client";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
};

export function Container({
  children,
  className = "",
  size = "md",
}: ContainerProps) {
  return (
    <div className={`${sizeClasses[size]} mx-auto px-6 md:px-8 ${className}`}>
      {children}
    </div>
  );
}
