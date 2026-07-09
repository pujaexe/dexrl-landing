import type { ComponentType } from "react";
import {
  AlertCircle,
  ArrowLeftRight,
  Building2,
  Check,
  CheckCircle,
  Clock,
  Coins,
  Copy,
  DollarSign,
  ExternalLink,
  Flame,
  HelpCircle,
  History,
  Info,
  Loader,
  RefreshCw,
  Route,
  Search,
  User,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { GoogleIcon, MetamaskIcon } from "./brand";

type IconProps = {
  className?: string;
  name: string;
  size?: number;
};

type LucideLike = ComponentType<{ className?: string; size?: number | string }>;

// Maps the iconify name strings used across the widget to lucide equivalents.
const ICON_MAP: Record<string, LucideLike> = {
  "lucide:alert-circle": AlertCircle,
  "lucide:check-circle": CheckCircle,
  "mdi:check-circle": CheckCircle,
  "material-symbols:check": Check,
  "mdi:check-bold": Check,
  "ic:baseline-content-copy": Copy,
  "material-symbols:close": X,
  "material-symbols:close-rounded": X,
  "material-symbols:info-outline-rounded": Info,
  "material-symbols:route-outline": Route,
  "material-symbols:history": History,
  "mdi:account-outline": User,
  "mdi:history": History,
  "mdi:loading": Loader,
  "mdi:currency-usd": DollarSign,
  "mingcute:question-2-fill": HelpCircle,
  "mingcute:search-2-line": Search,
  "mingcute:flash-line": Zap,
  "mdi:search": Search,
  "lucide:search": Search,
  "lucide:coins": Coins,
  "lucide:wallet": Wallet,
  "lucide:flame": Flame,
  "lucide:building-2": Building2,
  "ci:arrow-left-right": ArrowLeftRight,
  "solar:question-circle-outline": HelpCircle,
  "solar:wallet-outline": Wallet,
  "icon-park-outline:time": Clock,
  "ion:arrow-up-right-box-outline": ExternalLink,
  "radix-icons:external-link": ExternalLink,
  "jam:refresh-reverse": RefreshCw,
};

export const Iconify = ({ className, name, size }: IconProps) => {
  if (name === "flat-color-icons:google") {
    return (
      <GoogleIcon className={className} style={size ? { width: size, height: size } : undefined} />
    );
  }
  if (name === "logos:metamask-icon") {
    return (
      <MetamaskIcon className={className} style={size ? { width: size, height: size } : undefined} />
    );
  }
  const Cmp = ICON_MAP[name] ?? HelpCircle;
  // Default to 1em so the icon follows the className font-size (text-xl/2xl),
  // matching how the old iconify icons sized — lucide ignores font-size otherwise.
  return <Cmp className={className} size={size ?? "1em"} />;
};
