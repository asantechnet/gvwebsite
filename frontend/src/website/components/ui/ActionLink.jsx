import { ArrowLeft } from "lucide-react";
import Button from "./Button";
import { useLocalizedHref } from "@website/hooks/useWebsiteLanguage.js";

function ActionLink({
  href,
  children,
  variant = "primary",
  className = "",
  icon: Icon = ArrowLeft,
}) {
  const localizedHref = useLocalizedHref(href);

  return (
    <Button
      as="a"
      href={localizedHref}
      variant={variant}
      icon={Icon}
      className={`min-h-10 px-5 text-sm font-semibold ${className}`.trim()}
    >
      {children}
    </Button>
  );
}

export default ActionLink;
