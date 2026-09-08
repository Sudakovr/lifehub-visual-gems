import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LifeHub — визуальные эталоны продукта" },
      {
        name: "description",
        content: "Дизайн-система LifeHub: токены, типографика и примитивы интерфейса на странице /kit.",
      },
      { property: "og:title", content: "LifeHub — визуальные эталоны продукта" },
      {
        property: "og:description",
        content: "Дизайн-система LifeHub: токены, типографика и примитивы интерфейса.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <main className="min-h-screen bg-canvas">
      <div className="mx-auto max-w-2xl px-lg py-4xl">
        <p className="text-meta text-muted-foreground">LifeHub</p>
        <h1 className="mt-xs text-display font-semibold">Визуальные эталоны</h1>
        <p className="mt-sm text-body-lg text-muted-foreground">
          Собрана основа дизайн-системы: семантические токены двух тем, типографика и набор
          примитивов.
        </p>
        <Link
          to="/kit"
          className="mt-xl inline-flex h-9 items-center rounded-sm bg-accent px-lg text-body font-medium text-accent-foreground transition-fast hover:bg-accent-hover"
        >
          Открыть набор примитивов
        </Link>
      </div>
    </main>
  );
}
