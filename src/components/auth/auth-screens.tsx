import * as React from "react";
import { Link } from "@tanstack/react-router";
import { AlertCircle, Check, Clock } from "lucide-react";
import { Button, Field, Input, Avatar } from "@/components/kit/primitives";
import { ThemeToggle } from "@/components/app/app-shell";
import { cn } from "@/lib/utils";

/* Четыре экрана входа одной композицией: слева форма, справа спокойная опора. */

const Nav = Link as unknown as React.FC<{ to: string; className?: string; children?: React.ReactNode }>;

function AuthFrame({
  title,
  note,
  children,
  footer,
}: {
  title: string;
  note: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-canvas text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-app flex-col px-lg py-xl lg:flex-row lg:gap-4xl lg:py-3xl">
        <div className="flex w-full flex-col lg:max-w-md">
          <div className="flex items-center justify-between">
            <Nav to="/" className="text-body font-semibold text-foreground">
              LifeHub
            </Nav>
            <ThemeToggle />
          </div>

          <div className="mt-3xl flex flex-col gap-xl">
            <div className="flex flex-col gap-xs">
              <h1 className="text-heading font-semibold text-foreground">{title}</h1>
              <p className="max-w-prose text-meta text-muted-foreground">{note}</p>
            </div>
            {children}
          </div>

          <div className="mt-auto pt-2xl text-meta text-muted-foreground">{footer}</div>
        </div>

        <div className="mt-2xl hidden flex-1 border-l border-border pl-4xl lg:mt-0 lg:flex lg:flex-col lg:justify-center">
          <p className="text-caption text-muted-foreground">Что внутри</p>
          <ul className="mt-md flex flex-col">
            {[
              ["Проекты и задачи", "Статусы, приёмка работы, подзадачи любой глубины."],
              ["День под контролем", "План дня, просрочки и входящие в одном экране."],
              ["Файлы и заметки", "Документы и договорённости рядом с задачей."],
              ["Учёт времени", "Таймер и ручные записи, оплачиваемое отдельно."],
            ].map(([t, d]) => (
              <li key={t} className="border-b border-border py-md last:border-b-0">
                <p className="text-body font-medium text-foreground">{t}</p>
                <p className="text-meta text-muted-foreground">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Banner({
  tone,
  title,
  text,
}: {
  tone: "danger" | "ok" | "warn";
  title: string;
  text: string;
}) {
  const Icon = tone === "ok" ? Check : tone === "warn" ? Clock : AlertCircle;
  return (
    <div
      role="status"
      className={cn(
        "flex gap-sm rounded-md border px-md py-sm",
        tone === "danger" && "border-danger/30 bg-danger-soft",
        tone === "warn" && "border-warn/30 bg-warn-soft",
        tone === "ok" && "border-ok/30 bg-ok-soft",
      )}
    >
      <Icon
        className={cn(
          "mt-0.5 size-4 shrink-0",
          tone === "danger" && "text-danger-foreground",
          tone === "warn" && "text-warn-foreground",
          tone === "ok" && "text-ok-foreground",
        )}
        strokeWidth={1.75}
      />
      <span className="flex flex-col gap-2xs">
        <span
          className={cn(
            "text-body font-medium",
            tone === "danger" && "text-danger-foreground",
            tone === "warn" && "text-warn-foreground",
            tone === "ok" && "text-ok-foreground",
          )}
        >
          {title}
        </span>
        <span className="text-meta text-muted-foreground">{text}</span>
      </span>
    </div>
  );
}

export function LoginScreen() {
  const [failed, setFailed] = React.useState(false);

  return (
    <AuthFrame
      title="Вход в LifeHub"
      note="Продолжите там, где остановились: план дня, задачи и проекты."
      footer={
        <span>
          Нет аккаунта? <Nav to="/auth/register" className="text-accent underline underline-offset-4">Создать</Nav>
        </span>
      }
    >
      {failed ? (
        <Banner
          tone="danger"
          title="Почта и пароль не совпадают"
          text="Проверьте раскладку и регистр. Если пароль забыт — восстановите его по ссылке ниже."
        />
      ) : null}

      <form
        className="flex flex-col gap-lg"
        onSubmit={(e) => {
          e.preventDefault();
          setFailed(true);
        }}
      >
        <Field label="Почта">
          <Input type="email" defaultValue="anna@lifehub.ru" invalid={failed} autoComplete="email" />
        </Field>
        <Field label="Пароль">
          <Input type="password" defaultValue="0000" invalid={failed} autoComplete="current-password" />
        </Field>
        <div className="flex flex-wrap items-center justify-between gap-sm">
          <Nav to="/auth/reset" className="text-meta text-accent underline underline-offset-4">
            Восстановить пароль
          </Nav>
          <Button type="submit">Войти</Button>
        </div>
      </form>
    </AuthFrame>
  );
}

export function RegisterScreen() {
  return (
    <AuthFrame
      title="Создать аккаунт"
      note="Личное пространство создаётся сразу и остаётся только вашим."
      footer={
        <span>
          Уже есть аккаунт? <Nav to="/auth/login" className="text-accent underline underline-offset-4">Войти</Nav>
        </span>
      }
    >
      <form className="flex flex-col gap-lg" onSubmit={(e) => e.preventDefault()}>
        <Field label="Имя и фамилия">
          <Input defaultValue="Анна Верёвкина" autoComplete="name" />
        </Field>
        <Field label="Почта">
          <Input type="email" placeholder="anna@example.ru" autoComplete="email" />
        </Field>
        <Field label="Пароль" hint="От 10 символов, без пробелов по краям.">
          <Input type="password" autoComplete="new-password" />
        </Field>
        <Button type="submit">Создать аккаунт</Button>
      </form>
    </AuthFrame>
  );
}

export function ResetScreen() {
  const [sent, setSent] = React.useState(false);

  return (
    <AuthFrame
      title="Восстановление пароля"
      note="Пришлём ссылку на смену пароля. Ссылка действует час."
      footer={
        <span>
          Вспомнили пароль? <Nav to="/auth/login" className="text-accent underline underline-offset-4">Войти</Nav>
        </span>
      }
    >
      {sent ? (
        <Banner
          tone="ok"
          title="Письмо отправлено на anna@lifehub.ru"
          text="Откройте ссылку из письма и задайте новый пароль. Письма нет — проверьте папку со спамом."
        />
      ) : null}

      <form
        className="flex flex-col gap-lg"
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
      >
        <Field label="Почта">
          <Input type="email" defaultValue="anna@lifehub.ru" autoComplete="email" />
        </Field>
        <div className="flex flex-wrap items-center gap-sm">
          <Button type="submit">{sent ? "Отправить ещё раз" : "Прислать ссылку"}</Button>
          {sent ? <span className="text-meta text-muted-foreground">Повтор доступен через 1:00</span> : null}
        </div>
      </form>
    </AuthFrame>
  );
}

export function InviteScreen() {
  const [expired, setExpired] = React.useState(false);

  return (
    <AuthFrame
      title="Приглашение в пространство"
      note="Примите приглашение, чтобы видеть проекты и задачи команды."
      footer={
        <button className="text-meta text-accent underline underline-offset-4" onClick={() => setExpired((v) => !v)}>
          {expired ? "Показать действующее приглашение" : "Показать истёкшее приглашение"}
        </button>
      }
    >
      <div className="flex flex-col gap-lg border-y border-border py-lg">
        <div className="flex items-center gap-md">
          <Avatar name="Мария Ким" />
          <div className="flex flex-col">
            <p className="text-body text-foreground">Мария Ким приглашает вас</p>
            <p className="text-meta text-muted-foreground">maria@pirs.studio · владелец пространства</p>
          </div>
        </div>
        <dl className="grid gap-md sm:grid-cols-2">
          <div>
            <dt className="text-caption text-muted-foreground">Пространство</dt>
            <dd className="text-body text-foreground">Студия «Пирс» · рабочее</dd>
          </div>
          <div>
            <dt className="text-caption text-muted-foreground">Ваша роль</dt>
            <dd className="text-body text-foreground">Участник — создаёт и меняет объекты</dd>
          </div>
        </dl>
      </div>

      {expired ? (
        <>
          <Banner
            tone="warn"
            title="Срок приглашения истёк"
            text="Ссылка действовала 7 дней. Попросите Марию Ким прислать новую — доступ откроется сразу."
          />
          <Button variant="secondary">Запросить новое приглашение</Button>
        </>
      ) : (
        <div className="flex flex-wrap items-center gap-sm">
          <Button>Принять приглашение</Button>
          <Button variant="ghost">Отказаться</Button>
        </div>
      )}
    </AuthFrame>
  );
}
