import type { ComponentType } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, HelpCircle, Plus, X } from "lucide-react";

type IconProps = {
  className?: string;
  name: string;
};

const ICON: Record<string, ComponentType<{ className?: string; size?: number | string }>> = {
  "chevron-down": ChevronDown,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  close: X,
  plus: Plus,
  question: HelpCircle,
};

export const Icon = ({ className, name }: IconProps) => {
  const Cmp = ICON[name] ?? HelpCircle;
  // 1em so it follows the className font-size (matching the old FontAwesome icons).
  return <Cmp className={className} size="1em" />;
};
