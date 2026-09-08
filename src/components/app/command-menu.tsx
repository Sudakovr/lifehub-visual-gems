import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { commandItems, type CommandItem } from "@/mock/shell";
import { cn } from "@/lib/utils";

const Nav = Link as unknown as React.FC<{
  to: string;
  params?: Record<string, string> | undefined;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}>;

/* Командное меню по Cmd+K: задачи, проекты, заметки и действия одним списком. */
export function CommandMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = React.useState("");
  const [cursor, setCursor] = React.useState(0);

  const found = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return commandItems.filter((i) => !q || i.title.toLowerCase().includes(q) || i.note.toLowerCase().includes(q));
  }, [query]);

  React.useEffect(() => {
    if (open) {
      setQuery("");
      setCursor(0);
    }
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setCursor((c) => Math.min(c + 1, found.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setCursor((c) => Math.max(c - 1, 0));
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, found.length]);

  if (!open) return null;

  const groups: CommandItem["group"][] = ["Задачи", "Проекты", "Заметки", "Действия"];
  let index = -1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-foreground/30 px-lg pt-4xl"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Командное меню"
        className="flex w-full max-w-dialog-wide flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-e3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-md border-b border-border px-lg">
          <Search className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCursor(0);
            }}
            placeholder="Задача, проект, заметка или действие"
            aria-label="Поиск по продукту"
            className="h-12 w-full bg-transparent text-body-lg text-foreground outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden shrink-0 rounded-xs border border-border px-xs py-2xs text-caption text-muted-foreground sm:block">
            Esc
          </kbd>
        </div>

        <div className="max-h-96 overflow-y-auto py-xs">
          {found.length === 0 ? (
            <div className="px-lg py-xl">
              <p className="text-body text-foreground">Ничего не нашлось по запросу «{query}»</p>
              <p className="mt-2xs text-meta text-muted-foreground">Попробуйте номер задачи или название проекта.</p>
            </div>
          ) : (
            groups.map((g) => {
              const items = found.filter((i) => i.group === g);
              if (items.length === 0) return null;
              return (
                <div key={g}>
                  <p className="px-lg pt-md pb-xs text-caption text-muted-foreground">{g}</p>
                  {items.map((i) => {
                    index += 1;
                    const active = index === cursor;
                    const body = (
                      <span className="flex w-full items-center gap-md">
                        <span className="flex min-w-0 flex-col">
                          <span className="truncate text-body text-foreground">{i.title}</span>
                          <span className="truncate text-meta text-muted-foreground">{i.note}</span>
                        </span>
                        {i.shortcut ? (
                          <kbd className="ml-auto shrink-0 rounded-xs border border-border px-xs py-2xs text-caption text-muted-foreground">
                            {i.shortcut}
                          </kbd>
                        ) : null}
                      </span>
                    );
                    const klass = cn(
                      "block w-full px-lg py-sm text-left transition-fast hover:bg-surface-pressed",
                      active && "bg-surface-pressed",
                    );
                    return i.to ? (
                      <Nav key={i.id} to={i.to} params={i.params} className={klass} onClick={onClose}>
                        {body}
                      </Nav>
                    ) : (
                      <button
                        key={i.id}
                        className={klass}
                        onClick={() => {
                          onClose();
                          if (i.shortcut === "N") window.dispatchEvent(new CustomEvent("lifehub:quick-add"));
                          if (i.title === "Переключить тему")
                            document.documentElement.classList.toggle("dark");
                        }}
                      >
                        {body}
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        <div className="flex items-center gap-md border-t border-border px-lg py-sm text-caption text-muted-foreground">
          <span>Стрелки — выбор</span>
          <span>Enter — открыть</span>
          <span className="ml-auto">Cmd + K</span>
        </div>
      </div>
    </div>
  );
}
