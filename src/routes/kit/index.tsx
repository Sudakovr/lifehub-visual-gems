import { createFileRoute } from "@tanstack/react-router";
import { KitSections } from "@/components/kit/kit-sections";

export const Route = createFileRoute("/kit/")({
  head: () => ({
    meta: [
      { title: "LifeHub — дизайн-система и примитивы" },
      {
        name: "description",
        content:
          "Эталонная страница LifeHub: токены, типографика и все примитивы интерфейса в светлой и тёмной теме.",
      },
      { property: "og:title", content: "LifeHub — дизайн-система и примитивы" },
      {
        property: "og:description",
        content: "Токены, типографика и все примитивы интерфейса LifeHub в двух темах.",
      },
    ],
  }),
  component: KitPage,
});

function ThemePane({ theme, children }: { theme: "light" | "dark"; children: React.ReactNode }) {
  return (
    <section className={theme === "dark" ? "dark" : undefined}>
      <div className="bg-canvas text-foreground">
        <div className="mx-auto max-w-kit px-lg py-2xl sm:px-2xl">
          <header className="mb-2xl flex flex-wrap items-baseline gap-md border-b border-border pb-lg">
            <h2 className="text-heading font-semibold">
              {theme === "light" ? "Светлая тема" : "Тёмная тема"}
            </h2>
            <p className="text-meta text-muted-foreground">
              Одни и те же токены, разные значения
            </p>
          </header>
          {children}
        </div>
      </div>
    </section>
  );
}

function KitPage() {
  return (
    <main className="min-h-screen bg-canvas">
      <div className="mx-auto max-w-kit px-lg pt-3xl sm:px-2xl">
        <p className="text-meta text-muted-foreground">LifeHub · дизайн-система</p>
        <h1 className="mt-xs text-display font-semibold">Примитивы интерфейса</h1>
        <p className="mt-sm max-w-copy text-body-lg text-muted-foreground">
          Все элементы собраны из семантических токенов: поверхности, текст, границы, акцент,
          статусы, отступы, радиусы, тени, типографика и длительности. Ниже один и тот же набор в
          обеих темах.
        </p>
      </div>
      <ThemePane theme="light">
        <KitSections />
      </ThemePane>
      <ThemePane theme="dark">
        <KitSections />
      </ThemePane>
    </main>
  );
}
