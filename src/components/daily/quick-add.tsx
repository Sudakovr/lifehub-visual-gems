import * as React from "react";
import { Loader2, Mic, Sparkles, WifiOff, X } from "lucide-react";
import { Button, Field, Input, Select } from "@/components/kit/primitives";
import { quickAddExample, quickAddParsed, inboxProjects, type ParsedField } from "@/mock/daily";
import { cn } from "@/lib/utils";

/*
  Быстрый ввод задачи: оверлей по клавише N с любого экрана.
  Одно поле, ИИ разбирает фразу в черновик, каждое поле правится до создания.
*/

type Phase = "ввод" | "разбор" | "черновик" | "ошибка" | "офлайн" | "диктовка" | "расшифровка";

export function QuickAdd() {
  const [open, setOpen] = React.useState(false);
  const [phase, setPhase] = React.useState<Phase>("ввод");
  const [text, setText] = React.useState("");
  const [fields, setFields] = React.useState<ParsedField[]>(quickAddParsed);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = e.target as HTMLElement | null;
      const typing = el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
      if (!open && !typing && (e.key === "n" || e.key === "т" || e.key === "N" || e.key === "Т")) {
        e.preventDefault();
        reset();
        setOpen(true);
      }
      if (open && e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Открытие из шапки и командного меню
  React.useEffect(() => {
    function onOpen() {
      reset();
      setOpen(true);
    }
    window.addEventListener("lifehub:quick-add", onOpen);
    return () => window.removeEventListener("lifehub:quick-add", onOpen);
  }, []);

  React.useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function reset() {
    setPhase("ввод");
    setText("");
    setFields(quickAddParsed);
  }

  function parse(raw: string) {
    const value = raw.trim();
    if (!value) return;
    if (!navigator.onLine) {
      setPhase("офлайн");
      return;
    }
    setPhase("разбор");
    window.setTimeout(() => {
      if (value.toLowerCase() === quickAddExample.toLowerCase() || value.includes(",")) {
        setFields(
          quickAddParsed.map((f) => (f.label === "Название" ? { ...f, value: value.split(",")[0]!.trim() } : f)),
        );
        setPhase("черновик");
      } else {
        setFields(
          quickAddParsed.map((f) =>
            f.label === "Название" ? { ...f, value, recognized: true } : { ...f, value: "—", recognized: false },
          ),
        );
        setPhase("ошибка");
      }
    }, 900);
  }

  function dictate() {
    setPhase("диктовка");
    window.setTimeout(() => {
      setPhase("расшифровка");
      window.setTimeout(() => {
        setText(quickAddExample);
        setFields(quickAddParsed);
        setPhase("черновик");
      }, 900);
    }, 1400);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-foreground/30 px-lg pt-4xl" role="presentation" onClick={() => setOpen(false)}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Быстрый ввод задачи"
        className="flex w-full max-w-dialog flex-col rounded-lg border border-border bg-surface shadow-e3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-md border-b border-border px-lg py-md">
          <Sparkles className="size-4 text-accent" strokeWidth={1.75} />
          <h2 className="text-body font-semibold text-foreground">Новая задача одной фразой</h2>
          <span className="num ml-auto text-meta text-muted-foreground">N</span>
          <Button variant="ghost" size="icon" aria-label="Закрыть быстрый ввод" onClick={() => setOpen(false)}>
            <X className="size-4" strokeWidth={1.75} />
          </Button>
        </div>

        <div className="flex flex-col gap-md px-lg py-lg">
          <div className="flex items-center gap-sm">
            <Input
              ref={inputRef}
              aria-label="Фраза задачи"
              placeholder={quickAddExample}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") parse(text);
              }}
            />
            <Button variant="secondary" size="icon" aria-label="Продиктовать голосом" onClick={dictate}>
              <Mic className="size-4" strokeWidth={1.75} />
            </Button>
            <Button onClick={() => parse(text)} disabled={phase === "разбор"}>
              Разобрать
            </Button>
          </div>

          {phase === "разбор" ? (
            <p className="flex items-center gap-sm text-meta text-muted-foreground">
              <Loader2 className="size-4 animate-spin" strokeWidth={1.75} />
              ИИ разбирает фразу на поля
            </p>
          ) : null}

          {phase === "диктовка" ? (
            <p className="flex items-center gap-sm text-meta text-foreground">
              <span className="size-2 animate-pulse rounded-full bg-danger" aria-hidden />
              Идёт запись. Скажите фразу целиком и нажмите «Готово».
            </p>
          ) : null}

          {phase === "расшифровка" ? (
            <p className="flex items-center gap-sm text-meta text-muted-foreground">
              <Loader2 className="size-4 animate-spin" strokeWidth={1.75} />
              Расшифровываем запись
            </p>
          ) : null}

          {phase === "ошибка" ? (
            <p className="rounded-md border border-warn/30 bg-warn-soft px-md py-sm text-meta text-warn-foreground">
              Разобрать фразу не удалось. Текст остался в названии — заполните остальные поля вручную.
            </p>
          ) : null}

          {phase === "офлайн" ? (
            <p className="flex items-center gap-sm rounded-md border border-border bg-surface-sunken px-md py-sm text-meta text-muted-foreground">
              <WifiOff className="size-4" strokeWidth={1.75} />
              Нет сети. Задача сохранится черновиком и разберётся, когда связь вернётся.
            </p>
          ) : null}

          {phase === "черновик" || phase === "ошибка" ? (
            <div className="flex flex-col gap-md border-t border-border pt-md">
              <p className="text-meta text-muted-foreground">
                Распознанные поля подсвечены. Любое можно поправить до создания.
              </p>
              <div className="grid gap-md sm:grid-cols-2">
                {fields.map((f) => (
                  <Field key={f.label} label={f.label} id={`qa-${f.label}`}>
                    {f.label === "Проект" ? (
                      <Select
                        id={`qa-${f.label}`}
                        value={f.value}
                        className={cn(f.recognized && "border-accent bg-accent-soft")}
                        onChange={(e) =>
                          setFields((list) =>
                            list.map((x) => (x.label === f.label ? { ...x, value: e.target.value } : x)),
                          )
                        }
                      >
                        {[f.value, ...inboxProjects.filter((p) => p !== f.value)].map((p) => (
                          <option key={p}>{p}</option>
                        ))}
                      </Select>
                    ) : (
                      <Input
                        id={`qa-${f.label}`}
                        value={f.value}
                        className={cn(f.recognized && "border-accent bg-accent-soft")}
                        onChange={(e) =>
                          setFields((list) =>
                            list.map((x) => (x.label === f.label ? { ...x, value: e.target.value } : x)),
                          )
                        }
                      />
                    )}
                  </Field>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-end gap-sm border-t border-border px-lg py-md">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Отменить
          </Button>
          <Button onClick={() => setOpen(false)} disabled={phase === "ввод" || phase === "разбор"}>
            Создать задачу
          </Button>
        </div>
      </div>
    </div>
  );
}
