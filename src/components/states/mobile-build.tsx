import { AppShell, PageHeading } from "@/components/app/app-shell";
import { SectionHead } from "@/components/projects/shared";

/* Мобильная сборка: те же экраны в рамке 390 px, без отдельной версии продукта. */

const frames: { title: string; note: string; src: string }[] = [
  { title: "Список задач", note: "Одна колонка, срок и приоритет в строке, действия в меню «…».", src: "/my" },
  { title: "Канбан", note: "Колонки листаются вбок, заголовок колонки прилипает сверху.", src: "/projects/p-1/board" },
  { title: "Задача", note: "Содержание, свойства и лента идут одним потоком.", src: "/tasks/2481" },
  { title: "Лента задачи листом", note: "Комментарии и события вперемешку, фильтр «Только обсуждение».", src: "/tasks/2481" },
  { title: "Быстрый ввод", note: "Одно поле и разбор фразы: экран «Сегодня», клавиша N или кнопка «+».", src: "/today" },
];

export function MobileBuild() {
  return (
    <AppShell>
      <PageHeading
        title="Мобильная сборка"
        note="Ширина 390 px — ограничение каждого экрана продукта. Ниже настоящие экраны в рамке телефона."
      />

      <div className="mt-2xl flex flex-col gap-2xl">
        <SectionHead title="Экраны" note="прокручиваются внутри рамки" />
        <div className="flex gap-2xl overflow-x-auto pb-lg">
          {frames.map((f) => (
            <figure key={f.title} className="flex w-phone shrink-0 flex-col gap-md">
              <div
                className="overflow-hidden rounded-lg border border-border-strong bg-surface"
                style={{ height: "var(--container-phone-h)" }}
              >
                <iframe
                  src={f.src}
                  title={f.title}
                  loading="lazy"
                  className="size-full border-0"
                />
              </div>
              <figcaption className="flex flex-col gap-2xs">
                <span className="text-body font-medium text-foreground">{f.title}</span>
                <span className="text-meta text-muted-foreground">{f.note}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
