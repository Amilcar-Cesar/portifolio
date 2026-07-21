import React from "react";

interface SkillBadgeProps {
  name: string;
}

export default function SkillBadge({ name }: SkillBadgeProps) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 border border-border text-xs font-mono font-medium rounded bg-border/10 text-text hover:border-accent hover:bg-accent/5 transition-colors">
      {name.toLowerCase()}
    </span>
  );
}
