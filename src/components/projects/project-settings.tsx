import * as React from "react";
import { Avatar, Button, Field, Input, Select, Textarea } from "@/components/kit/primitives";
import { KebabMenu } from "@/components/app/kebab-menu";
import { Modal } from "@/components/app/modal";
import { SectionHead, TagDot } from "@/components/projects/shared";
import { getProject, projectMembers, spaceTags } from "@/mock/projects";

export function ProjectSettings({ id }: { id: string }) {
  const project = getProject(id);
  const [archiveOpen, setArchiveOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [confirmName, setConfirmName] = React.useState("");

  return (
    <div className="flex flex-col gap-2xl">
      <SectionHead
        title="Настройки проекта"
        action={
          <div className="flex items-center gap-sm">
            <Button variant="secondary" size="sm" onClick={() => setArchiveOpen(true)}>
              В архив
            </Button>
            <Button size="sm">Сохранить изменения</Button>
            <KebabMenu
              items={[{ label: "Дублировать проект" }, { label: "Скопировать ссылку" }]}
              destructive={{ label: "Удалить проект", onSelect: () => setDeleteOpen(true) }}
            />
          </div>
        }
      />

      <section className="grid gap-2xl lg:grid-cols-2">
        <div className="flex flex-col gap-lg">
          <Field label="Название" id="s-name">
            <Input id="s-name" defaultValue={project.name} />
          </Field>
          <Field label="Описание" id="s-desc" hint="Видно всем участникам проекта.">
            <Textarea id="s-desc" defaultValue={project.summary} />
          </Field>
          <div className="grid gap-lg sm:grid-cols-3">
            <Field label="Статус" id="s-status">
              <Select id="s-status" defaultValue={project.status}>
                {["Черновик", "Активен", "Пауза", "Завершён", "Отменён"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </Select>
            </Field>
            <Field label="Дата начала" id="s-start">
              <Input id="s-start" defaultValue="02.06.2026" />
            </Field>
            <Field label="Плановое завершение" id="s-end">
              <Input id="s-end" defaultValue="14.06.2026" />
            </Field>
          </div>
        </div>

        <div className="flex flex-col gap-xl">
          <div className="flex flex-col gap-lg">
            <SectionHead title="Участники проекта" note={`${projectMembers.length} человек`} action={<Button variant="secondary" size="sm">Пригласить</Button>} />
            <ul className="divide-y divide-border">
              {projectMembers.map((m) => (
                <li key={m.id} className="flex items-center gap-md py-sm">
                  <Avatar name={m.name} />
                  <span className="flex min-w-0 flex-col">
                    <span className="text-body text-foreground">{m.name}</span>
                    <span className="text-meta text-muted-foreground">{m.title}</span>
                  </span>
                  <Select
                    aria-label={`Роль участника ${m.name}`}
                    className="ml-auto w-40"
                    defaultValue={m.role}
                    disabled={m.role === "owner"}
                  >
                    <option value="owner">Владелец</option>
                    <option value="member">Участник</option>
                    <option value="viewer">Только чтение</option>
                  </Select>
                  {m.role === "owner" ? null : (
                    <KebabMenu items={[{ label: "Передать владение" }]} destructive={{ label: "Исключить из проекта" }} />
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-lg">
            <SectionHead title="Теги проекта" note="теги общие для пространства" />
            <div className="flex flex-wrap gap-sm">
              {spaceTags.map((t) => (
                <TagDot key={t.id} name={t.name} />
              ))}
            </div>
            <div>
              <Button variant="secondary" size="sm">
                Управлять тегами пространства
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Modal
        open={archiveOpen}
        title="Перенести проект в архив"
        description="Проект «Запуск платёжного шлюза» перестанет попадать в списки и уведомления. Задачи, файлы и время сохранятся и останутся доступны для чтения."
        onClose={() => setArchiveOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setArchiveOpen(false)}>
              Отменить
            </Button>
            <Button onClick={() => setArchiveOpen(false)}>Перенести в архив</Button>
          </>
        }
      />

      <Modal
        open={deleteOpen}
        title="Удалить проект"
        description={`Удаление уберёт проект «${project.name}», ${project.tasksTotal} задач, файлы, заметки и записи времени. Восстановить их будет нельзя.`}
        onClose={() => {
          setDeleteOpen(false);
          setConfirmName("");
        }}
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setDeleteOpen(false);
                setConfirmName("");
              }}
            >
              Отменить
            </Button>
            <Button disabled={confirmName.trim() !== project.name} onClick={() => setDeleteOpen(false)}>
              Удалить проект
            </Button>
          </>
        }
      >
        <Field
          label="Введите название проекта, чтобы подтвердить"
          id="del-name"
          hint={`Точное название: ${project.name}`}
        >
          <Input id="del-name" value={confirmName} onChange={(e) => setConfirmName(e.target.value)} />
        </Field>
      </Modal>
    </div>
  );
}
