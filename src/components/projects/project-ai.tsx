import * as React from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { Button, Input } from "@/components/kit/primitives";
import { Modal } from "@/components/app/modal";
import { aiAnswer } from "@/mock/content";

/* Вопрос по проекту и ответ ИИ со списком источников. Любое изменение — только после подтверждения. */

const Nav = Link as unknown as React.FC<{
  to: string;
  params?: Record<string, string> | undefined;
  className?: string;
  children?: React.ReactNode;
}>;

export function ProjectAiAnswer() {
  const [question, setQuestion] = React.useState(aiAnswer.question);
  const [confirm, setConfirm] = React.useState(false);
  const [created, setCreated] = React.useState(false);

  return (
    <section className="border-t border-border pt-lg">
      <div className="flex items-center gap-sm">
        <Sparkles className="size-4 text-accent" strokeWidth={1.75} />
        <h2 className="text-body font-semibold text-foreground">Спросить ИИ о проекте</h2>
      </div>

      <div className="mt-md flex flex-wrap items-center gap-sm">
        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          aria-label="Вопрос по проекту"
          placeholder="Например: что мешает закрыть проект в срок"
          className="min-w-64 flex-1"
        />
        <Button variant="secondary">Спросить</Button>
      </div>

      <div className="mt-lg">
        <p className="text-meta text-muted-foreground">
          Ответ сгенерирован ИИ по задачам, заметкам и файлам проекта. Проверьте по источникам.
        </p>
        <p className="mt-sm max-w-prose text-body-lg text-foreground">{aiAnswer.text}</p>

        <h3 className="mt-lg text-meta text-muted-foreground">Источники</h3>
        <ul className="mt-xs divide-y divide-border border-y border-border">
          {aiAnswer.sources.map((s) => (
            <li key={s.label} className="flex flex-wrap items-baseline justify-between gap-md py-sm">
              <Nav to={s.to} params={s.params} className="text-body text-foreground transition-fast hover:text-accent">
                {s.label}
              </Nav>
              <span className="text-meta text-muted-foreground">{s.note}</span>
            </li>
          ))}
        </ul>

        <div className="mt-lg flex flex-wrap items-center gap-md">
          <p className="min-w-0 flex-1 text-body text-foreground">
            ИИ предлагает: {aiAnswer.proposal.title}.{" "}
            <span className="text-muted-foreground">Мы ничего не создадим без вашего подтверждения.</span>
          </p>
          {created ? (
            <span className="text-meta text-ok-strong">Задача создана</span>
          ) : (
            <Button variant="secondary" onClick={() => setConfirm(true)}>
              Проверить и создать
            </Button>
          )}
        </div>
      </div>

      <Modal
        open={confirm}
        title="Создать задачу по предложению ИИ?"
        description={aiAnswer.proposal.title}
        onClose={() => setConfirm(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirm(false)}>
              Не создавать
            </Button>
            <Button
              onClick={() => {
                setCreated(true);
                setConfirm(false);
              }}
            >
              Создать задачу
            </Button>
          </>
        }
      >
        <p className="text-body text-foreground">{aiAnswer.proposal.detail}</p>
        <p className="text-meta text-muted-foreground">
          Вы останетесь постановщиком: приёмку будете вести вы.
        </p>
      </Modal>
    </section>
  );
}
