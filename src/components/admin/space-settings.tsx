import * as React from "react";
import { AppShell, PageHeading } from "@/components/app/app-shell";
import { KebabMenu } from "@/components/app/kebab-menu";
import { Modal } from "@/components/app/modal";
import { SectionHead } from "@/components/projects/shared";
import {
  Avatar,
  Button,
  Field,
  Input,
  Select,
  StatusChip,
  Tag,
  Textarea,
  Toggle,
} from "@/components/kit/primitives";
import { adminTags, roleNote, roleTitle, spaceMembers, spaceModules, type SpaceRole } from "@/mock/admin";
import { cn } from "@/lib/utils";

/* Настройки пространства: общие, участники, теги, модули. Вид владельца и наблюдателя. */

const tabs = ["Общие", "Участники и роли", "Теги", "Модули"] as const;
type Tab = (typeof tabs)[number];

export function SpaceSettings() {
  const [tab, setTab] = React.useState<Tab>("Общие");
  const [viewer, setViewer] = React.useState(false);
  const [modules, setModules] = React.useState(spaceModules);
  const [requireReview, setRequireReview] = React.useState(true);
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [mergeOpen, setMergeOpen] = React.useState<string | null>(null);

  const ro = viewer;

  return (
    <AppShell>
      <PageHeading
        title="Настройки пространства «Работа»"
        note="Общие сведения, участники, теги и модули. Изменения видят все участники пространства."
        actions={
          <div className="flex flex-wrap items-center gap-md">
            <Toggle label="Смотреть глазами наблюдателя" checked={viewer} onChange={setViewer} />
            {ro ? null : <Button>Сохранить изменения</Button>}
          </div>
        }
      />

      {ro ? (
        <p className="mt-lg border-l-2 border-warn bg-warn-soft px-lg py-md text-meta text-warn-foreground">
          Роль «Только чтение»: настройки открыты для просмотра, изменять их может владелец пространства.
        </p>
      ) : null}

      <nav className="mt-xl -mb-px flex gap-lg overflow-x-auto border-b border-border" aria-label="Разделы настроек">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "border-b-2 pb-sm text-body whitespace-nowrap transition-fast",
              t === tab
                ? "border-accent font-medium text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </nav>

      <div className="pt-xl">
        {tab === "Общие" ? <General ro={ro} /> : null}
        {tab === "Участники и роли" ? <Members ro={ro} onInvite={() => setInviteOpen(true)} /> : null}
        {tab === "Теги" ? <Tags ro={ro} onMerge={setMergeOpen} /> : null}
        {tab === "Модули" ? (
          <Modules
            ro={ro}
            modules={modules}
            requireReview={requireReview}
            onToggle={(id, v) => setModules((m) => m.map((x) => (x.id === id ? { ...x, enabled: v } : x)))}
            onRequireReview={setRequireReview}
          />
        ) : null}
      </div>

      <Modal
        open={inviteOpen}
        title="Пригласить в пространство"
        description="Приглашение придёт письмом со ссылкой. Роль можно изменить в любой момент."
        onClose={() => setInviteOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setInviteOpen(false)}>
              Отменить
            </Button>
            <Button onClick={() => setInviteOpen(false)}>Отправить приглашение</Button>
          </>
        }
      >
        <Field label="Почта" id="inv-mail" hint="Можно указать несколько адресов через запятую.">
          <Input id="inv-mail" placeholder="anna@company.ru" />
        </Field>
        <Field label="Роль" id="inv-role" hint={roleNote.member}>
          <Select id="inv-role" defaultValue="member">
            <option value="member">Участник</option>
            <option value="viewer">Только чтение</option>
          </Select>
        </Field>
      </Modal>

      <Modal
        open={mergeOpen !== null}
        title="Объединить теги"
        description="Все объекты второго тега получат первый тег, второй тег исчезнет из пространства."
        onClose={() => setMergeOpen(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setMergeOpen(null)}>
              Отменить
            </Button>
            <Button onClick={() => setMergeOpen(null)}>Объединить теги</Button>
          </>
        }
      >
        <Field label="Оставить тег" id="mg-keep">
          <Select id="mg-keep" defaultValue="t5">
            {adminTags.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Присоединить тег" id="mg-drop" hint="Тег «Доки» стоит на 2 объектах.">
          <Select id="mg-drop" defaultValue={mergeOpen ?? "t6"}>
            {adminTags.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </Select>
        </Field>
      </Modal>
    </AppShell>
  );
}

function General({ ro }: { ro: boolean }) {
  return (
    <section className="grid gap-2xl lg:grid-cols-2">
      <div className="flex flex-col gap-lg">
        <Field label="Название пространства" id="sp-name">
          <Input id="sp-name" defaultValue="Работа" disabled={ro} />
        </Field>
        <Field label="Описание" id="sp-desc" hint="Помогает новым участникам понять, что здесь ведут.">
          <Textarea
            id="sp-desc"
            disabled={ro}
            defaultValue="Клиентские проекты студии: платёжный шлюз, переезд офиса и поддержка магазина."
          />
        </Field>
        <div className="grid gap-lg sm:grid-cols-2">
          <Field label="Тон пространства" id="sp-tone" hint="Тон отличает пространства в переключателе.">
            <Select id="sp-tone" defaultValue="accent" disabled={ro}>
              <option value="accent">Синий</option>
              <option value="ok">Зелёный</option>
              <option value="warn">Янтарный</option>
              <option value="info">Голубой</option>
            </Select>
          </Field>
          <Field label="Часовой пояс" id="sp-tz">
            <Select id="sp-tz" defaultValue="msk" disabled={ro}>
              <option value="msk">Москва, UTC+3</option>
              <option value="ekb">Екатеринбург, UTC+5</option>
              <option value="nsk">Новосибирск, UTC+7</option>
            </Select>
          </Field>
        </div>
      </div>

      <div className="flex flex-col gap-lg">
        <SectionHead title="Пространство" note="создано 12 января 2026" />
        <dl className="divide-y divide-border border-y border-border">
          {[
            ["Тип", "Рабочее, с приглашёнными участниками"],
            ["Владелец", "Роман Гладков"],
            ["Участников", "5, включая одно приглашение без ответа"],
            ["Проектов", "8 активных, 3 в архиве"],
            ["Задач", "214 всего, 63 открыто"],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-wrap items-baseline justify-between gap-md py-sm">
              <dt className="text-meta text-muted-foreground">{k}</dt>
              <dd className="text-body text-foreground">{v}</dd>
            </div>
          ))}
        </dl>
        {ro ? null : (
          <div className="flex items-center gap-sm">
            <Button variant="secondary">Передать владение</Button>
            <KebabMenu
              items={[{ label: "Экспортировать данные пространства" }]}
              destructive={{ label: "Удалить пространство" }}
            />
          </div>
        )}
      </div>
    </section>
  );
}

function Members({ ro, onInvite }: { ro: boolean; onInvite: () => void }) {
  return (
    <section className="flex flex-col gap-lg">
      <SectionHead
        title="Участники и роли"
        note={`${spaceMembers.length} человек`}
        action={ro ? undefined : <Button onClick={onInvite}>Пригласить участника</Button>}
      />
      <ul className="divide-y divide-border border-y border-border">
        {spaceMembers.map((m) => (
          <li key={m.id} className="flex flex-wrap items-center gap-md py-md">
            <Avatar name={m.name} />
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="flex flex-wrap items-center gap-sm text-body text-foreground">
                {m.name}
                {m.invitePending ? <StatusChip tone="warn">Приглашение отправлено</StatusChip> : null}
              </span>
              <span className="text-meta text-muted-foreground">{m.email}</span>
            </span>
            <span className="hidden w-32 text-meta text-muted-foreground sm:block">{m.lastSeen}</span>
            {ro || m.role === "owner" ? (
              <span className="w-40 text-body text-foreground">{roleTitle[m.role]}</span>
            ) : (
              <Select aria-label={`Роль участника ${m.name}`} className="w-40" defaultValue={m.role}>
                {(["member", "viewer"] as SpaceRole[]).map((r) => (
                  <option key={r} value={r}>
                    {roleTitle[r]}
                  </option>
                ))}
              </Select>
            )}
            {ro || m.role === "owner" ? null : (
              <KebabMenu
                items={[{ label: "Передать владение" }, { label: "Отправить приглашение заново" }]}
                destructive={{ label: "Исключить из пространства" }}
              />
            )}
          </li>
        ))}
      </ul>
      <dl className="grid gap-lg sm:grid-cols-3">
        {(["owner", "member", "viewer"] as SpaceRole[]).map((r) => (
          <div key={r} className="flex flex-col gap-2xs">
            <dt className="text-body font-medium text-foreground">{roleTitle[r]}</dt>
            <dd className="text-meta text-muted-foreground">{roleNote[r]}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Tags({ ro, onMerge }: { ro: boolean; onMerge: (id: string) => void }) {
  return (
    <section className="flex flex-col gap-lg">
      <SectionHead
        title="Теги пространства"
        note="теги общие для проектов, задач и заметок"
        action={ro ? undefined : <Button>Создать тег</Button>}
      />
      <ul className="divide-y divide-border border-y border-border">
        {adminTags.map((t) => (
          <li key={t.id} className="flex flex-wrap items-center gap-md py-md">
            <Tag color={t.color}>{t.name}</Tag>
            <span className="flex-1 text-meta text-muted-foreground">на {t.used} объектах</span>
            {ro ? null : (
              <>
                <Button variant="ghost" size="sm">
                  Переименовать
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onMerge(t.id)}>
                  Объединить
                </Button>
                <KebabMenu
                  items={[{ label: "Сменить цвет" }, { label: "Показать объекты с тегом" }]}
                  destructive={{ label: "Удалить тег" }}
                />
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function Modules({
  ro,
  modules,
  requireReview,
  onToggle,
  onRequireReview,
}: {
  ro: boolean;
  modules: typeof spaceModules;
  requireReview: boolean;
  onToggle: (id: string, v: boolean) => void;
  onRequireReview: (v: boolean) => void;
}) {
  return (
    <section className="flex flex-col gap-lg">
      <SectionHead title="Модули пространства" note="выключенный модуль скрывает свой раздел у всех участников" />
      <ul className="divide-y divide-border border-y border-border">
        {modules.map((m) => (
          <li key={m.id} className="flex flex-col gap-md py-md">
            <div className="flex flex-wrap items-center gap-md">
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="flex items-center gap-sm text-body text-foreground">
                  {m.name}
                  {m.locked ? <StatusChip>Основной модуль</StatusChip> : null}
                </span>
                <span className="text-meta text-muted-foreground">{m.note}</span>
              </span>
              {ro ? (
                <StatusChip tone={m.enabled ? "ok" : "neutral"}>{m.enabled ? "Включён" : "Выключен"}</StatusChip>
              ) : (
                <Toggle
                  label={m.enabled ? "Включён" : "Выключен"}
                  checked={m.enabled}
                  disabled={m.locked}
                  onChange={(v) => onToggle(m.id, v)}
                />
              )}
            </div>
            {m.id === "tasks" ? (
              <div className="ml-0 border-l border-border pl-lg sm:ml-lg">
                <div className="flex flex-wrap items-center justify-between gap-md">
                  <span className="flex flex-col">
                    <span className="text-body text-foreground">Требовать приёмку по умолчанию</span>
                    <span className="text-meta text-muted-foreground">
                      Новая задача создаётся с приёмкой постановщиком. В самой задаче признак можно снять.
                    </span>
                  </span>
                  {ro ? (
                    <StatusChip tone={requireReview ? "ok" : "neutral"}>
                      {requireReview ? "Включено" : "Выключено"}
                    </StatusChip>
                  ) : (
                    <Toggle
                      label={requireReview ? "Включено" : "Выключено"}
                      checked={requireReview}
                      onChange={onRequireReview}
                    />
                  )}
                </div>
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
