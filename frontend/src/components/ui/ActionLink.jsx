import { ArrowLeft } from "lucide-react";
import Button from "./Button";

function ActionLink({
  href,
  children,
  variant = "primary",
  className = "",
  icon: Icon = ArrowLeft,
}) {
  return (
    <Button
      as="a"
      href={href}
      variant={variant}
      icon={Icon}
      className={`min-h-10 px-5 text-sm font-semibold ${className}`.trim()}
    >
      {children}
    </Button>
  );
}

export default ActionLink;
