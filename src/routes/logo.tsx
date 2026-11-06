import { createFileRoute } from "@tanstack/react-router";
import { ThemeToggle } from "@/components/app/app-shell";
import { originalConcepts, logoStudies, type Concept, type LogoStudy } from "@/mock/logos";

export const Route = createFileRoute("/logo")({
  head: () => ({
    meta: [
      { title: "Моё звено — сравнение логотипов | myzveno.ru" },
      {
        name: "description",
        content: "Девять направлений логотипа myzveno.ru: пять новых со слитным и раздельным русским написанием, знаками в 24 px и монохромом, и четыре прежних варианта.",
      },
      { property: "og:title", content: "Моё звено — девять направлений логотипа" },
      { property: "og:description", content: "Сравнение «моёзвено» и «Моё звено»: сцепление, монограммы, общее ядро и переплетение. Прежние варианты сохранены." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LogoPage,
});

function LogoArtwork({ src, className }: { src: string; className: string }) {
  return <span aria-hidden="true" className={`logo-artwork ${className}`} style={{ maskImage: `url("${src}")` }} />;
}

function LogoLockup({ study, separated = false, monochrome = false }: { study: LogoStudy; separated?: boolean; monochrome?: boolean }) {
  return (
    <div className="logo-lockup" role="img" aria-label={`${study.name}: ${separated ? "Моё звено" : "моёзвено"}${monochrome ? ", одноцветная версия" : ""}`}>
      <LogoArtwork src={study.symbol} className={`size-logo-symbol ${monochrome ? "bg-logo-ink-inverse" : "bg-logo-study"}`} />
      <LogoArtwork src={separated ? study.separated : study.joined} className={`h-logo-word w-full ${monochrome ? "bg-logo-ink-inverse" : "bg-logo-ink"}`} />
    </div>
  );
}

function StudyBlock({ study }: { study: LogoStudy }) {
  return (
    <section className="flex min-w-0 flex-col gap-lg border-t border-border py-xl" aria-labelledby={`study-${study.id}`}>
      <div className="flex items-baseline gap-md">
        <span className="font-mono text-meta text-muted-foreground">{study.id}</span>
        <h3 id={`study-${study.id}`} className="text-title font-semibold">{study.name}</h3>
      </div>
      <p className="max-w-copy text-body text-muted-foreground">{study.description}</p>
      <div className="grid min-w-0 gap-lg md:grid-cols-2 xl:logo-comparison-grid">
        <div className="flex min-w-0 flex-col gap-sm">
          <span className="text-meta text-muted-foreground">моёзвено</span>
          <div className="flex min-h-24 items-center justify-center bg-logo-sheet px-lg py-xl">
            <LogoLockup study={study} />
          </div>
        </div>
        <div className="flex min-w-0 flex-col gap-sm">
          <span className="text-meta text-muted-foreground">Моё звено</span>
          <div className="flex min-h-24 items-center justify-center bg-logo-sheet px-lg py-xl">
            <LogoLockup study={study} separated />
          </div>
        </div>
        <div className="flex min-w-0 flex-col gap-sm md:col-span-2 xl:col-span-1">
          <span className="text-meta text-muted-foreground">Знак в 24 px</span>
          <div className="flex min-h-24 items-center justify-center gap-xl bg-logo-sheet px-lg py-xl" role="img" aria-label={`${study.name}: цветной и одноцветный знак в 24 px`}>
            <LogoArtwork src={study.symbol} className="size-logo-symbol-small bg-logo-study" />
            <LogoArtwork src={study.symbol} className="size-logo-symbol-small bg-logo-ink" />
          </div>
        </div>
      </div>
      <div className="grid gap-lg md:grid-cols-2">
        <div className="flex min-w-0 items-center justify-center bg-logo-sheet-inverse px-lg py-lg"><LogoLockup study={study} monochrome /></div>
        <div className="flex min-w-0 items-center justify-center bg-logo-sheet-inverse px-lg py-lg"><LogoLockup study={study} separated monochrome /></div>
      </div>
    </section>
  );
}

function ConceptBlock({ concept, index }: { concept: Concept; index: number }) {
  return (
    <section className="flex flex-col gap-lg border-t border-border pt-2xl">
      <div className="flex flex-col gap-xs">
        <h2 className="text-title font-semibold text-foreground">
          {index + 1}. {concept.name}
        </h2>
        <p className="max-w-prose text-body text-muted-foreground">{concept.idea}</p>
        <p className="max-w-prose text-meta text-muted-foreground">Где работает: {concept.where}</p>
      </div>
      <div className="grid gap-lg md:grid-cols-2">
        <div className="flex min-h-48 items-center justify-center border border-border bg-logo-sheet px-xl py-2xl">
          <img
            src={concept.src}
            alt={`Логотип «МоёЗвено» — ${concept.name} на светлом фоне`}
            width={concept.width}
            height={concept.height}
            loading="lazy"
            className={concept.wide ? "w-full max-w-form" : "max-h-64 w-auto"}
          />
        </div>
        <div className="flex min-h-48 items-center justify-center border border-border bg-logo-sheet-inverse px-xl py-2xl">
          <img
            src={concept.src}
            alt={`Логотип «МоёЗвено» — ${concept.name}, белая версия на тёмном фоне`}
            width={concept.width}
            height={concept.height}
            loading="lazy"
            className={concept.wide ? "w-full max-w-form brightness-0 invert" : "max-h-64 w-auto brightness-0 invert"}
          />
        </div>
      </div>
    </section>
  );
}

function LogoPage() {
  return (
    <div className="min-h-screen bg-canvas text-foreground">
      <div className="mx-auto flex w-full max-w-app flex-col gap-3xl px-lg py-3xl">
        <header className="flex items-start justify-between gap-lg">
          <div className="flex flex-col gap-sm">
            <h1 className="text-heading font-semibold text-foreground">Логотип «Моё звено»</h1>
            <p className="max-w-prose text-body-lg text-muted-foreground">
              myzveno.ru
            </p>
          </div>
          <ThemeToggle />
        </header>
        <section className="flex min-w-0 flex-col gap-lg" aria-labelledby="new-logos">
          <div className="flex flex-col gap-sm">
            <h2 id="new-logos" className="text-heading font-semibold">Новые варианты</h2>
            <p className="text-body text-muted-foreground">Слитное и раздельное написание, отдельный знак и одноцветная версия.</p>
          </div>
          <div>{logoStudies.map((study) => <StudyBlock key={study.id} study={study} />)}</div>
        </section>
        <section className="flex min-w-0 flex-col gap-xl" aria-labelledby="previous-logos">
          <h2 id="previous-logos" className="text-heading font-semibold">Прежние варианты</h2>
          {originalConcepts.map((concept, index) => (
            <ConceptBlock key={concept.name} concept={concept} index={index} />
          ))}
        </section>
      </div>
    </div>
  );
}
