import { createFileRoute } from "@tanstack/react-router";
import { ThemeToggle } from "@/components/app/app-shell";
import logoLinks from "@/assets/logo-myzveno-links.png";
import logoKnot from "@/assets/logo-myzveno-knot.png";
import logoLettering from "@/assets/logo-myzveno-lettering.png";
import logoNodes from "@/assets/logo-myzveno-nodes.png";

export const Route = createFileRoute("/logo")({
  head: () => ({
    meta: [
      { title: "LifeHub — варианты логотипа «МоёЗвено»" },
      {
        name: "description",
        content: "Концепты логотипа для myzveno.ru: звенья цепи, знак-«З», леттеринг и цепочка узлов — на светлой и тёмной подложке.",
      },
      { property: "og:title", content: "Варианты логотипа «МоёЗвено»" },
      { property: "og:description", content: "Четыре концепта логотипа для myzveno.ru на светлой и тёмной подложке." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LogoPage,
});

type Concept = {
  name: string;
  idea: string;
  where: string;
  src: string;
  width: number;
  height: number;
  wide: boolean;
};

const concepts: Concept[] = [
  {
    name: "Два звена",
    idea: "Сцепленные звенья одной линией: задачи и проекты связаны в одну цепь. Горизонтальная композиция.",
    where: "Шапка сайта, подпись в письмах, любые узкие места.",
    src: logoLinks,
    width: 976,
    height: 301,
    wide: true,
  },
  {
    name: "Звено-«З»",
    idea: "Квадратное звено, которое читается как буква «З». Знак над названием, компактный.",
    where: "Иконка приложения, favicon, аватар в соцсетях.",
    src: logoKnot,
    width: 898,
    height: 906,
    wide: false,
  },
  {
    name: "Леттеринг",
    idea: "Только название: буква «З» нарисована открытым звеном внутри слова. Без отдельного знака.",
    where: "Горизонтальные места, где знак уже не нужен: футер, документы.",
    src: logoLettering,
    width: 993,
    height: 235,
    wide: true,
  },
  {
    name: "Цепочка узлов",
    idea: "Три узла на одной линии — цепочка связанных задач. Средний узел выделен спокойным синим.",
    where: "Шапка сайта, экран входа, презентации.",
    src: logoNodes,
    width: 1029,
    height: 239,
    wide: true,
  },
];

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
        <div className="flex min-h-48 items-center justify-center border border-border bg-surface px-xl py-2xl">
          <img
            src={concept.src}
            alt={`Логотип «МоёЗвено» — ${concept.name} на светлом фоне`}
            width={concept.width}
            height={concept.height}
            loading="lazy"
            className={concept.wide ? "w-full max-w-form" : "max-h-64 w-auto"}
          />
        </div>
        <div className="flex min-h-48 items-center justify-center border border-border bg-foreground px-xl py-2xl">
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
            <h1 className="text-heading font-semibold text-foreground">Логотип «МоёЗвено»</h1>
            <p className="max-w-prose text-body-lg text-muted-foreground">
              Четыре концепта для myzveno.ru. Слева — основная версия на светлом, справа — белая
              монохромная на тёмном: так принято в гайдлайнах, когда цветной знак на тёмном теряется.
              По проекту логотип пока не размещён.
            </p>
          </div>
          <ThemeToggle />
        </header>
        {concepts.map((concept, index) => (
          <ConceptBlock key={concept.name} concept={concept} index={index} />
        ))}
      </div>
    </div>
  );
}
