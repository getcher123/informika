# Документация

В этой папке собрана техническая документация по платформе «Инноватика Мособлгаз»: требования по фазам, описание интерфейсов, бизнес‑процессы и инфраструктурные заметки.

## Быстрые ссылки

- Краткий обзор (границы Ф1–Ф3): [specs/overview.md](specs/overview.md)
- Фаза 1 (Запросы и идеи): [specs/phases/tech-spec-F1.md](specs/phases/tech-spec-F1.md)
- Фаза 2 (Сопровождение одобренных идей в Bitrix24): [specs/phases/tech-spec-F2.md](specs/phases/tech-spec-F2.md)
- Фаза 3 (Кейсы, события, аналитика): [specs/phases/tech-spec-F3.md](specs/phases/tech-spec-F3.md)
- Описание экранов и элементов UI: [ui/interface-elements.md](ui/interface-elements.md)
- Статусы сущностей: [ui/statuses-table.md](ui/statuses-table.md)
- Бизнес‑процессы: [processes/business-processes.md](processes/business-processes.md)
- Уведомления: [processes/notification-table.md](processes/notification-table.md)
- Инфраструктура/Bitrix/WWW: [infra/architecture.md](infra/architecture.md), [infra/hosting.md](infra/hosting.md)

## Структура папки `docs/`

- `specs/` — технические задания (что и зачем делаем)
  - `overview.md` — общий обзор, роли, жизненные циклы и границы фаз
  - `phases/` — ТЗ по фазам (Ф1/Ф2/Ф3)
  - `pages/` — ТЗ на отдельные страницы/экраны (если выделяются отдельно)
- `ui/` — UI‑описания, унификация и таблицы значений (как это выглядит в интерфейсе)
- `processes/` — бизнес‑процессы, регламенты и таблицы автоматизаций/уведомлений
- `analytics/` — таблицы метрик/отчётности и сводные справочники
- `infra/` — инфраструктура, Bitrix‑гайды, карта страниц и структура WWW
- `setup/` — шаги по настройке окружения/локальной работы (инструкции «как поднять/проверить»)
- `testing/` — тестовые данные и планы проверок
- `reports/` — отчёты по фазам/результатам работ
- `research/` — планы/отчёты исследовательских задач
- `bitrix-docs-new/` — локальный vault документации Bitrix (большой объём; не редактировать без необходимости)

## Принципы актуальности

- Источники истины: требования из `docs/specs/` + актуальные мокапы в `Layouts/Mockups/`.
- Если меняются макеты/UX, синхронизируем соответствующие документы из `docs/specs/`, `docs/ui/`, `docs/processes/`.
