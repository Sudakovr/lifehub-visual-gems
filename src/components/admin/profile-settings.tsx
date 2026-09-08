import * as React from "react";
import { AppShell, PageHeading, ThemeToggle } from "@/components/app/app-shell";
import { KebabMenu } from "@/components/app/kebab-menu";
import { SectionHead } from "@/components/projects/shared";
import { Avatar, Button, Checkbox, Field, Input, Select, Toggle } from "@/components/kit/primitives";
import { notificationSettings } from "@/mock/admin";
import { cn } from "@/lib/utils";

/* Профиль и уведомления пользователя. */

export function ProfileSettings() {
  const [rows, setRows] = React.useState(notificationSettings);
  const [quiet, setQuiet] = React.useState(true);
  const [digest, setDigest] = React.useState(true);

  function set(id: string, key: "email" | "push", v: boolean) {
    setRows((r) => r.map((x) => (x.id === id ? { ...x, [key]: v } : x)));
  }

  return (
    <AppShell>
      <PageHeading
        title="Профиль и уведомления"
        note="Как вас видят коллеги и о чём продукт сообщает вам."
        actions={<Button>Сохранить изменения</Button>}
      />

      <div className="mt-2xl grid gap-3xl lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <section className="flex flex-col gap-xl">
          <div className="flex flex-col gap-lg">
            <SectionHead title="Профиль" />
            <div className="flex items-center gap-lg">
              <Avatar name="Роман Гладков" size="lg" />
              <div className="flex flex-col gap-xs">
                <Button variant="secondary" size="sm">
                  Загрузить фото
                </Button>
                <span className="text-meta text-muted-foreground">PNG или JPG, до 2 МБ.</span>
              </div>
            </div>
            <Field label="Имя и фамилия" id="pf-name">
              <Input id="pf-name" defaultValue="Роман Гладков" />
            </Field>
            <Field label="Должность" id="pf-title" hint="Видна в карточках задач и списках участников.">
              <Input id="pf-title" defaultValue="Руководитель студии" />
            </Field>
            <Field label="Почта" id="pf-mail" hint="На неё приходят письма и приглашения.">
              <Input id="pf-mail" type="email" defaultValue="roman@lifehub.ru" />
            </Field>
            <div className="grid gap-lg sm:grid-cols-2">
              <Field label="Часовой пояс" id="pf-tz">
                <Select id="pf-tz" defaultValue="msk">
                  <option value="msk">Москва, UTC+3</option>
                  <option value="ekb">Екатеринбург, UTC+5</option>
                </Select>
              </Field>
              <Field label="Начало недели" id="pf-week">
                <Select id="pf-week" defaultValue="mon">
                  <option value="mon">Понедельник</option>
                  <option value="sun">Воскресенье</option>
                </Select>
              </Field>
            </div>
          </div>

          <div className="flex flex-col gap-lg">
            <SectionHead title="Оформление" />
            <div className="flex flex-wrap items-center justify-between gap-md border-y border-border py-md">
              <span className="flex flex-col">
                <span className="text-body text-foreground">Тема интерфейса</span>
                <span className="text-meta text-muted-foreground">Светлая и тёмная переключаются кнопкой в шапке.</span>
              </span>
              <ThemeToggle />
            </div>
            <Checkbox label="Компактная плотность списков по умолчанию" checked={false} onChange={() => {}} />
          </div>

          <div className="flex flex-col gap-lg">
            <SectionHead title="Доступ" />
            <Field label="Текущий пароль" id="pf-old">
              <Input id="pf-old" type="password" placeholder="••••••••" />
            </Field>
            <Field label="Новый пароль" id="pf-new" hint="Не короче 10 символов.">
              <Input id="pf-new" type="password" placeholder="••••••••" />
            </Field>
            <div className="flex items-center gap-sm">
              <Button variant="secondary">Сменить пароль</Button>
              <KebabMenu
                items={[{ label: "Завершить сеансы на других устройствах" }, { label: "Скачать мои данные" }]}
                destructive={{ label: "Удалить аккаунт" }}
              />
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-lg">
          <SectionHead title="Уведомления" note="письмо и push настраиваются отдельно" />
          <table className="w-full border-collapse text-body">
            <thead>
              <tr className="border-b border-border text-left text-meta text-muted-foreground">
                <th scope="col" className="py-sm font-normal">
                  Событие
                </th>
                <th scope="col" className="w-24 py-sm font-normal">
                  Письмо
                </th>
                <th scope="col" className="w-24 py-sm font-normal">
                  Push
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="py-md pr-lg align-top">
                    <span className="flex flex-col">
                      <span className="text-foreground">{r.name}</span>
                      <span className="text-meta text-muted-foreground">{r.note}</span>
                    </span>
                  </td>
                  <td className="py-md align-top">
                    <Toggle
                      label={`Письмо: ${r.name}`}
                      checked={r.email}
                      onChange={(v) => set(r.id, "email", v)}
                    />
                  </td>
                  <td className="py-md align-top">
                    <Toggle label={`Push: ${r.name}`} checked={r.push} onChange={(v) => set(r.id, "push", v)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={cn("flex flex-col gap-md border-t border-border pt-lg")}>
            <div className="flex flex-wrap items-center justify-between gap-md">
              <span className="flex flex-col">
                <span className="text-body text-foreground">Тихие часы</span>
                <span className="text-meta text-muted-foreground">С 21:00 до 09:00 push не приходит, письма копятся.</span>
              </span>
              <Toggle label="Тихие часы" checked={quiet} onChange={setQuiet} />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-md">
              <span className="flex flex-col">
                <span className="text-body text-foreground">Утреннее письмо с планом дня</span>
                <span className="text-meta text-muted-foreground">Одно письмо в 08:30 вместо десятка уведомлений.</span>
              </span>
              <Toggle label="Письмо с планом дня" checked={digest} onChange={setDigest} />
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
