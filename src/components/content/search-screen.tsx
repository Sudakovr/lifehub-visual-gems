import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { AppShell, PageHeading } from "@/components/app/app-shell";
import { Button, Input, Skeleton } from "@/components/kit/primitives";
import { searchHints, searchHits, searchKinds, type SearchHit } from "@/mock/content";

/* Поиск по пространствам: одно поле, группировка по типам, подсветка совпадений. */

const Nav = Link as unknown as React.FC<{
  to: string;
  params?: Record<string, string>;
  className?: string;
  children?: React.ReactNode;
}>;

function Highlight({ text, term }: { text: string; term: string }) {
  const q = term.trim();
  if (!q) return <>{text}</>;
  const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return (
    <>
      {parts.map((p, i) =>
        p.toLowerCase() === q.toLowerCase() ? (
          <mark key={i} className="rounded-xs bg-accent-soft px-2xs text-accent-strong">
            {p}
          </mark>
        ) : (
          <React.Fragment key={i}>{p}</React.Fragment>
        ),
      )}
    </>
  );
}

export function SearchScreen() {
  const [q, setQ] = React.useState("смета");
  const [kind, setKind] = React.useState<SearchHit["kind"] | null>(null);
  const [space, setSpace] = React.useState<string | null>(null);
  const [period, setPeriod] = React.useState("За всё время");
  const [loading, setLoading] = React.useState(false);
  const timer = React.useRef<number | null>(null);

  function onQuery(value: string) {
    setQ(value);
    setLoading(value.trim().length > 0);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setLoading(false), 500);
  }

  const hits = searchHits.filter(
    (h) =>
      (kind ? h.kind === kind : true) &&
      (space ? h.space === space : true) &&
      (q.trim() ? (h.title + h.snippet).toLowerCase().includes(q.trim().toLowerCase()) : false),
  );
  const spaces = [...new Set(searchHits.map((h) => h.space))];

  return (
    <AppShell>
      <PageHeading title="Поиск" note="Задачи, проекты, заметки и файлы всех ваших пространств." />

      <div className="mt-xl">
        <span className="relative block">
          <Search
            className="pointer-events-none absolute left-md top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            strokeWidth={1.75}
          />
          <Input
            value={q}
            onChange={(e) => onQuery(e.target.value)}
            aria-label="Поисковый запрос"
            placeholder="Что ищем: слово из названия, номер задачи, имя файла"
            className="h-11 pl-3xl text-body-lg"
          />
        </span>
      </div>

      <div className="mt-md flex flex-wrap items-center gap-md">
        <span className="flex flex-wrap items-center gap-xs">
          <Button variant={kind === null ? "secondary" : "ghost"} size="sm" onClick={() => setKind(null)}>
            Все типы
          </Button>
          {searchKinds.map((k) => (
            <Button key={k} variant={kind === k ? "secondary" : "ghost"} size="sm" onClick={() => setKind(k)}>
              {k}
            </Button>
          ))}
        </span>
        <span className="flex flex-wrap items-center gap-xs">
          <Button variant={space === null ? "secondary" : "ghost"} size="sm" onClick={() => setSpace(null)}>
            Все пространства
          </Button>
          {spaces.map((s) => (
            <Button key={s} variant={space === s ? "secondary" : "ghost"} size="sm" onClick={() => setSpace(s)}>
              {s}
            </Button>
          ))}
        </span>
        <span className="flex flex-wrap items-center gap-xs">
          {["За всё время", "За неделю", "За месяц"].map((p) => (
            <Button key={p} variant={period === p ? "secondary" : "ghost"} size="sm" onClick={() => setPeriod(p)}>
              {p}
            </Button>
          ))}
        </span>
      </div>

      {q.trim() === "" ? (
        <div className="mt-2xl border-t border-border pt-lg">
          <p className="text-body text-foreground">Начните с одного слова — поиск смотрит в названия, тексты и файлы.</p>
          <ul className="mt-md flex flex-wrap items-center gap-xs">
            {searchHints.map((h) => (
              <li key={h}>
                <Button variant="ghost" size="sm" onClick={() => onQuery(h)}>
                  {h}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      ) : loading ? (
        <div className="mt-2xl flex flex-col gap-md border-t border-border pt-lg" aria-live="polite">
          <p className="text-meta text-muted-foreground">Ищем «{q}»</p>
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : hits.length === 0 ? (
        <div className="mt-2xl flex flex-col items-start gap-md border-t border-border pt-2xl">
          <p className="text-display font-semibold text-foreground">По запросу «{q}» ничего нет</p>
          <p className="max-w-prose text-body text-muted-foreground">
            Оставьте одно слово без окончания и снимите фильтры по типу и пространству — так находится чаще.
          </p>
          <div className="flex items-center gap-sm">
            <Button
              variant="secondary"
              onClick={() => {
                setKind(null);
                setSpace(null);
              }}
            >
              Снять фильтры
            </Button>
            <Button variant="ghost" onClick={() => onQuery("смета")}>
              Искать «смета»
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-xl flex flex-col gap-2xl">
          <p className="text-meta text-muted-foreground">
            Найдено {hits.length} · {period.toLowerCase()}
          </p>
          {searchKinds
            .filter((k) => hits.some((h) => h.kind === k))
            .map((k) => (
              <section key={k}>
                <h2 className="border-b border-border pb-sm text-title font-semibold text-foreground">
                  {k}{" "}
                  <span className="num text-meta font-normal text-muted-foreground">
                    {hits.filter((h) => h.kind === k).length}
                  </span>
                </h2>
                <ul className="divide-y divide-border">
                  {hits
                    .filter((h) => h.kind === k)
                    .map((h) => (
                      <li key={h.id} className="py-md">
                        <Nav
                          to={h.to}
                          params={h.params}
                          className="text-body font-medium text-foreground transition-fast hover:text-accent"
                        >
                          <Highlight text={h.title} term={q} />
                        </Nav>
                        <p className="mt-2xs max-w-prose text-meta text-muted-foreground">
                          <Highlight text={h.snippet} term={q} />
                        </p>
                        <p className="mt-2xs text-caption text-muted-foreground">
                          {h.meta} · {h.space} · {h.date}
                        </p>
                      </li>
                    ))}
                </ul>
              </section>
            ))}
        </div>
      )}
    </AppShell>
  );
}
