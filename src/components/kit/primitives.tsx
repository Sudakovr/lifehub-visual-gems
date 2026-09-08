import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, Loader2 } from "lucide-react";

/* ------------------------------------------------------------------
   Базовые примитивы LifeHub. Только семантические токены.
------------------------------------------------------------------ */

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-sm rounded-md font-medium transition-fast transition-colors disabled:pointer-events-none disabled:text-disabled-foreground select-none",

  {
    variants: {
      variant: {
        primary:
          "bg-action text-action-foreground shadow-e1 hover:bg-action-hover disabled:bg-surface-sunken disabled:shadow-none",
        ok:
          "bg-ok text-white hover:bg-ok-hover disabled:bg-surface-sunken",
        secondary:
          "bg-surface text-foreground border border-border hover:bg-surface-pressed disabled:bg-surface-sunken",
        ghost: "text-foreground hover:bg-surface-pressed",
        link: "text-accent underline underline-offset-4 hover:text-accent-hover px-0",
      },
      size: {
        sm: "h-8 px-md text-meta",
        md: "h-9 px-lg text-body",
        lg: "h-11 px-xl text-body-lg",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  loading,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { loading?: boolean }) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={props.disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="size-4 animate-spin" strokeWidth={1.75} /> : null}
      {children}
    </button>
  );
}

export function Field({
  label,
  hint,
  error,
  children,
  id,
}: {
  label: string;
  hint?: string;
  error?: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-xs">
      <label htmlFor={id} className="text-meta font-medium text-muted-foreground">
        {label}
      </label>
      {children}
      {error ? (
        <span className="text-meta text-danger-foreground">{error}</span>
      ) : hint ? (
        <span className="text-meta text-muted-foreground">{hint}</span>
      ) : null}
    </div>
  );
}

const controlBase =
  "w-full rounded-sm border bg-surface px-md text-body text-foreground placeholder:text-muted-foreground transition-fast transition-colors hover:border-border-strong disabled:bg-surface-sunken disabled:text-disabled-foreground disabled:hover:border-border";

export function Input({
  className,
  invalid,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
  ref?: React.Ref<HTMLInputElement>;
}) {
  return (
    <input
      className={cn(controlBase, "h-9", invalid ? "border-danger" : "border-border", className)}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea className={cn(controlBase, "min-h-20 border-border py-sm", className)} {...props} />
  );
}

export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select className={cn(controlBase, "h-9 appearance-none border-border pr-8", className)} {...props}>
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-md size-4 -translate-y-1/2 text-muted-foreground"
        strokeWidth={1.75}
      />
    </div>
  );
}

export function Checkbox({
  label,
  checked,
  indeterminate,
  disabled,
  onChange,
}: {
  label: string;
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <label
      className={cn(
        "inline-flex cursor-pointer items-center gap-sm text-body",
        disabled && "cursor-not-allowed text-disabled-foreground",
      )}
    >
      <span className="relative inline-flex">
        <input
          type="checkbox"
          className="peer size-4 cursor-pointer appearance-none rounded-xs border border-border-strong bg-surface transition-fast transition-colors checked:border-accent checked:bg-accent disabled:cursor-not-allowed disabled:border-border disabled:bg-surface-sunken"
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
        />
        {checked ? (
          <Check
            className="pointer-events-none absolute inset-0 m-auto size-3 text-accent-foreground"
            strokeWidth={2.5}
          />
        ) : indeterminate ? (
          <span className="pointer-events-none absolute inset-0 m-auto h-px w-2 bg-border-strong" />
        ) : null}
      </span>
      {label}
    </label>
  );
}

export function Toggle({
  label,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label
      className={cn(
        "inline-flex cursor-pointer items-center gap-sm text-body",
        disabled && "cursor-not-allowed text-disabled-foreground",
      )}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-5 w-9 shrink-0 rounded-full border transition-base transition-colors",
          checked ? "border-accent bg-accent" : "border-border-strong bg-surface-sunken",
          disabled && "cursor-not-allowed opacity-60",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 size-3.5 rounded-full bg-surface transition-base",
            checked ? "left-4.5" : "left-0.5",
          )}
        />
      </button>
      {label}
    </label>
  );
}

/* --- Статусы и приоритеты: цвет + текст + форма метки --------- */

export type Tone = "neutral" | "info" | "ok" | "warn" | "danger" | "accent";

const toneClass: Record<Tone, string> = {
  neutral: "bg-surface-sunken text-muted-foreground border-border",
  info: "bg-info-soft text-info-foreground border-info/30",
  ok: "bg-ok-soft text-ok-foreground border-ok/30",
  warn: "bg-warn-soft text-warn-foreground border-warn/30",
  danger: "bg-danger-soft text-danger-foreground border-danger/30",
  accent: "bg-accent-soft text-accent border-accent/30",
};

const dotClass: Record<Tone, string> = {
  neutral: "bg-border-strong",
  info: "bg-info",
  ok: "bg-ok",
  warn: "bg-warn",
  danger: "bg-danger",
  accent: "bg-accent",
};

export function StatusChip({ tone = "neutral", children }: { tone?: Tone; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full border px-md py-0.5 text-meta font-medium",
        toneClass[tone],
      )}
    >
      {children}
    </span>
  );
}


export function PriorityChip({ level }: { level: "Критический" | "Высокий" | "Обычный" | "Низкий" }) {
  const map = {
    Критический: { tone: "danger" as Tone, bars: 3 },
    Высокий: { tone: "warn" as Tone, bars: 2 },
    Обычный: { tone: "neutral" as Tone, bars: 1 },
    Низкий: { tone: "neutral" as Tone, bars: 0 },
  }[level];
  return (
    <span className={cn("inline-flex items-center gap-sm whitespace-nowrap rounded-full border px-md py-0.5 text-meta font-medium", toneClass[map.tone])}>
      <span className="flex items-end gap-0.5" aria-hidden>
        {[1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn(
              "w-0.5 rounded-full",
              i === 1 ? "h-1.5" : i === 2 ? "h-2" : "h-2.5",
              i <= map.bars ? dotClass[map.tone] : "bg-border",
            )}
          />
        ))}
      </span>
      {level}
    </span>
  );
}

export function Tag({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-xs rounded-full border border-border bg-surface px-md py-0.5 text-meta text-foreground">
      <span className="size-2 rounded-xs" style={{ backgroundColor: color }} aria-hidden />
      {children}
    </span>
  );
}

/* --- Аватары --------------------------------------------------- */

const avatarSizes = { sm: "size-6 text-caption", md: "size-8 text-meta", lg: "size-10 text-body" };

export function Avatar({
  name,
  size = "md",
  className,
}: {
  name: string;
  size?: keyof typeof avatarSizes;
  className?: string;
}) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
  return (
    <span
      title={name}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full border border-border bg-surface-sunken font-medium text-muted-foreground",
        avatarSizes[size],
        className,
      )}
    >
      {initials}
    </span>
  );
}

export function AvatarGroup({ names, max = 3 }: { names: string[]; max?: number }) {
  const shown = names.slice(0, max);
  const rest = names.length - shown.length;
  return (
    <span className="inline-flex items-center">
      {shown.map((n) => (
        <Avatar key={n} name={n} className="-ml-1.5 ring-2 ring-surface first:ml-0" />
      ))}
      {rest > 0 ? (
        <span className="-ml-1.5 inline-flex size-8 items-center justify-center rounded-full border border-border bg-surface text-meta text-muted-foreground ring-2 ring-surface num">
          +{rest}
        </span>
      ) : null}
    </span>
  );
}

/* --- Служебные состояния --------------------------------------- */

export function Skeleton({ className }: { className?: string }) {
  return <span className={cn("block animate-pulse rounded-xs bg-surface-pressed", className)} />;
}

export function Progress({ value, label }: { value: number; label?: string }) {
  return (
    <div className="flex flex-col gap-xs">
      {label ? (
        <div className="flex items-center justify-between text-meta text-muted-foreground">
          <span>{label}</span>
          <span className="num">{value}%</span>
        </div>
      ) : null}
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="h-full rounded-full bg-accent transition-slow" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function SectionTitle({ children, note }: { children: React.ReactNode; note?: string }) {
  return (
    <div className="flex flex-wrap items-baseline gap-md border-b border-border pb-sm">
      <h2 className="text-title font-semibold text-foreground">{children}</h2>
      {note ? <p className="text-meta text-muted-foreground">{note}</p> : null}
    </div>
  );
}

export function Row({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap items-center gap-md">{children}</div>;
}
