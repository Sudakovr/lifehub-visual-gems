import * as React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/kit/primitives";
import { cn } from "@/lib/utils";

export function Modal({
  open,
  title,
  description,
  onClose,
  footer,
  wide,
  children,
}: {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  footer?: React.ReactNode;
  wide?: boolean;
  children?: React.ReactNode;
}) {
  React.useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/30 p-lg sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "w-full rounded-lg border border-border bg-surface shadow-e3",
          wide ? "max-w-dialog-wide" : "max-w-dialog",
        )}
      >
        <div className="flex items-start justify-between gap-md border-b border-border px-xl py-lg">
          <div className="flex flex-col gap-2xs">
            <h2 className="text-title font-semibold text-foreground">{title}</h2>
            {description ? <p className="text-meta text-muted-foreground">{description}</p> : null}
          </div>
          <Button variant="ghost" size="icon" aria-label="Закрыть окно" onClick={onClose}>
            <X className="size-4" strokeWidth={1.75} />
          </Button>
        </div>
        {children ? <div className="flex flex-col gap-lg px-xl py-lg">{children}</div> : null}
        {footer ? (
          <div className="flex flex-wrap justify-end gap-sm border-t border-border px-xl py-lg">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}
