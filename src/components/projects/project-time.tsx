import * as React from "react";
import { Download, Play } from "lucide-react";
import { Metric } from "@/components/app/app-shell";
import { KebabMenu } from "@/components/app/kebab-menu";
import { Button, Select, StatusChip } from "@/components/kit/primitives";
import { ProgressBar, SectionHead, TaskLink } from "@/components/projects/shared";
import { hoursMinutes, projectTime, timeByPerson, timeByTask, timeEntries } from "@/mock/projects";

export function ProjectTime() {
  const [period, setPeriod] = React.useState("Июнь");
  const [onlyBillable, setOnlyBillable] = React.useState(false);
  const entries = timeEntries.filter((e) => !onlyBillable || e.billable);
  const maxPerson = Math.max(...timeByPerson.map((p) => p.minutes));
  const maxTask = Math.max(...timeByTask.map((t) => t.minutes));

  return (
    <div className="flex flex-col gap-2xl">
      <SectionHead
        title="Отчёт по времени"
        note={period}
        action={
          <div className="flex flex-wrap items-center gap-sm">
            <Select aria-label="Период отчёта" className="w-40" value={period} onChange={(e) => setPeriod(e.target.value)}>
              {["Эта неделя", "Июнь", "Май", "Квартал"].map((p) => (
                <option key={p}>{p}</option>
              ))}
            </Select>
            <Button variant="secondary" size="sm" onClick={() => setOnlyBillable((v) => !v)}>
              {onlyBillable ? "Показать всё время" : "Только оплачиваемое"}
            </Button>
            <Button variant="secondary" size="sm">
              <Download className="size-4" strokeWidth={1.75} />
              Выгрузить CSV
            </Button>
            <Button size="sm">
              <Play className="size-4" strokeWidth={1.75} />
              Запустить таймер
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-xl md:grid-cols-4">
        <Metric label="Всего за период" value={hoursMinutes(projectTime.totalMin)} note="по 5 участникам" />
        <Metric label="Оплачиваемое" value={hoursMinutes(projectTime.billableMin)} note="74 % от всего времени" />
        <Metric label="Не оплачиваемое" value={hoursMinutes(projectTime.totalMin - projectTime.billableMin)} note="встречи и согласования" />
        <Metric label="План проекта" value={hoursMinutes(projectTime.planMin)} note="запас 36 часов" />
      </div>

      <section className="grid gap-2xl lg:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-lg">
          <SectionHead title="По людям" note={`${timeByPerson.length} человек`} />
          <ul className="divide-y divide-border">
            {timeByPerson.map((p) => (
              <li key={p.person} className="flex flex-col gap-xs py-sm">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-md">
                  <span className="text-body text-foreground">{p.person}</span>
                  <span className="num flex flex-col items-end text-body sm:block">
                    {hoursMinutes(p.minutes)}
                    <span className="ml-sm text-meta text-muted-foreground">
                      оплачиваемое {hoursMinutes(p.billable)}
                    </span>
                  </span>
                </div>
                <ProgressBar value={Math.round((p.minutes / maxPerson) * 100)} />
              </li>
            ))}
          </ul>
        </div>

        <div className="flex min-w-0 flex-col gap-lg">
          <SectionHead title="По задачам" note={`${timeByTask.length} задач`} />
          <ul className="divide-y divide-border">
            {timeByTask.map((t) => (
              <li key={t.code} className="flex flex-col gap-xs py-sm">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-md">
                  <span className="min-w-0 text-body">
                    <TaskLink code={t.code} title={t.title} />
                  </span>
                  <span className="num flex flex-col items-end whitespace-nowrap text-body sm:block">
                    {hoursMinutes(t.minutes)}
                    <span className="ml-sm text-meta text-muted-foreground">
                      оплачиваемое {hoursMinutes(t.billable)}
                    </span>
                  </span>
                </div>
                <ProgressBar value={Math.round((t.minutes / maxTask) * 100)} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="flex flex-col gap-lg">
        <SectionHead title="Записи времени" note={`${entries.length} записей`} />
        <div className="overflow-x-auto">
          <table className="w-full min-w-table-wide border-collapse text-body">
            <thead>
              <tr className="border-b border-border-strong text-left text-meta text-muted-foreground">
                <th className="py-sm pr-md font-medium">Задача</th>
                <th className="px-md py-sm font-medium">Участник</th>
                <th className="px-md py-sm font-medium">Дата</th>
                <th className="px-md py-sm font-medium">Начало и конец</th>
                <th className="px-md py-sm text-right font-medium">Длительность</th>
                <th className="px-md py-sm font-medium">Оплата</th>
                <th className="px-md py-sm font-medium">Комментарий</th>
                <th className="py-sm pl-md" />
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id} className="border-b border-border transition-fast hover:bg-surface-pressed">
                  <td className="py-sm pr-md">
                    <TaskLink code={e.taskCode} title={e.task} />
                  </td>
                  <td className="px-md py-sm whitespace-nowrap">{e.person}</td>
                  <td className="num px-md py-sm whitespace-nowrap">{e.date}</td>
                  <td className="num px-md py-sm whitespace-nowrap">
                    {e.start} — {e.end}
                  </td>
                  <td className="num px-md py-sm text-right whitespace-nowrap">{hoursMinutes(e.minutes)}</td>
                  <td className="px-md py-sm">
                    <StatusChip tone={e.billable ? "ok" : "neutral"}>
                      {e.billable ? "Оплачиваемое" : "Внутреннее"}
                    </StatusChip>
                  </td>
                  <td className="px-md py-sm text-muted-foreground">{e.comment}</td>
                  <td className="py-sm pl-md text-right">
                    <KebabMenu
                      items={[{ label: "Изменить запись" }, { label: "Сделать оплачиваемой" }]}
                      destructive={{ label: "Удалить запись" }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
