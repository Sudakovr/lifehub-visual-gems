import * as React from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/kit/primitives";

export type MenuItem = { label: string; onSelect?: () => void };

/* Меню «…». «Удалить» — только здесь, последним пунктом за разделителем. */
export function KebabMenu({
  items,
  destructive,
  label = "Другие действия",
  align = "right",
}: {
  items: MenuItem[];
  destructive?: MenuItem;
  label?: string;
  align?: "left" | "right";
}) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        size="icon"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <MoreHorizontal className="size-4" strokeWidth={1.75} />
      </Button>
      {open ? (
        <div
          className={
            "absolute z-30 mt-xs w-64 rounded-md border border-border bg-surface py-xs shadow-e2 " +
            (align === "right" ? "right-0" : "left-0")
          }
        >
          {items.map((i) => (
            <button
              key={i.label}
              className="block w-full px-md py-sm text-left text-body text-foreground transition-fast hover:bg-surface-pressed"
              onClick={() => {
                setOpen(false);
                i.onSelect?.();
              }}
            >
              {i.label}
            </button>
          ))}
          {destructive ? (
            <>
              <div className="my-xs h-px bg-border" />
              <button
                className="block w-full px-md py-sm text-left text-body text-danger-foreground transition-fast hover:bg-danger-soft"
                onClick={() => {
                  setOpen(false);
                  destructive.onSelect?.();
                }}
              >
                {destructive.label}
              </button>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
