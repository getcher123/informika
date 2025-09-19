# Гайд: работа с GitHub Issues и Projects

## 0) Подготовка (1 раз)

- Установите GitHub CLI и войдите:
  - `gh auth login` → выберите HTTPS и вход через браузер.
- Скоупы для Projects v2:
  - `read:project` — чтение проектов; `project` — чтение/запись.
  - Обычно `project` достаточно, но некоторые команды gh проверяют наличие `read:project`. Если видите ошибку про недостающий `read:project`, запросите оба:
    - `gh auth refresh -h github.com -s project -s read:project`
  - В `gh auth status -t` может отображаться только `project` — это нормально (GitHub может «сворачивать» вложенные права в более высокий скоуп).

Примечание: см. документацию GitHub CLI.

## 1) Репозиторий и доступы

- Создание репозитория (из UI или CLI) и подключение локального git — стандартно.
- Добавить/удалить участника:
  - Личный репозиторий (UI): Settings → Collaborators → Add people. (см. GitHub Docs)
  - Через API/CLI (удобно автоматизировать):

Добавить:

```bash
gh api -X PUT \
  repos/<owner>/<repo>/collaborators/<username> \
  -f permission=push
```

Удалить:

```bash
gh api -X DELETE \
  repos/<owner>/<repo>/collaborators/<username>
```

Это обёртка над REST /repos/{owner}/{repo}/collaborators/{username} (см. GitHub Docs).

- Организация и команды (если репозиторий в org):
  - Создайте Team, задайте доступ к репозиторию через команду. (см. GitHub CLI)

## 2) Проект (GitHub Projects) — ваш канбан/таблица/roadmap

- Создать проект (user/organization-level):

```bash
gh project create --owner @me --title "Web App"
```

- Посмотреть список: `gh project list` (получите номер/ID — пригодится далее). (см. GitHub CLI)

Поля проекта (метаданные задач):

- Создайте поля Priority (SINGLE_SELECT), Estimate (NUMBER), Status (SINGLE_SELECT с вашими колонками):

```bash
gh project field-create <PROJECT_NUMBER> --owner @me \
  --name "Priority" --data-type SINGLE_SELECT \
  --single-select-options "P0,P1,P2"

gh project field-create <PROJECT_NUMBER> --owner @me \
  --name "Estimate" --data-type NUMBER

gh project field-create <PROJECT_NUMBER> --owner @me \
  --name "Status" --data-type SINGLE_SELECT \
  --single-select-options "Backlog,Ready,In progress,Review,Done"
```

- Итерации/«спринты» делайте полем Iteration (в UI проекта: Settings → Fields → Iteration), потом используйте их в Roadmap. (см. GitHub Docs)

Представления (views):

- Таблица/Board/Roadmap — меняются одной кнопкой; для канбана колонками ставьте поле Status. (см. GitHub Docs)

## 3) Бэклог

- Шаблоны задач: создайте issue templates в `.github/ISSUE_TEMPLATE/` (Bug/Task/Story) — чтобы все тикеты были единообразны.
- Справочник меток (labels) — P0/P1, type: bug/feature/chore, area: web/api/ui:

```bash
gh label create "P0" --color FF0000 --description "Critical"
gh label create "bug" --color D73A4A
gh label list
```

(см. GitHub CLI)

Быстрое создание проблем:

```bash
# одна задача
gh issue create -t "Auth: add password reset" \
  -b "Context… Acceptance…" \
  -l "feature,P1" -a @me

# массово (пример): из файла с заголовками
while read t; do gh issue create -t "$t" -l "P2"; done < titles.txt
```

Команды `create/list/edit` — стандартные подкоманды `gh issue`. (см. GitHub CLI)

Добавить задачи в Project:

```bash
# по URL issue
gh project item-add <PROJECT_NUMBER> --owner @me \
  --url https://github.com/<owner>/<repo>/issues/123
```

(см. GitHub CLI)

## 4) Команда и назначение исполнителей

- Назначить исполнителя:

```bash
gh issue edit 123 --add-assignee <user>
```

(или в UI). (см. GitHub CLI)

- Автозапрос ревьюверов по областям кода — через CODEOWNERS + защиту веток (требовать review, в т.ч. от владельцев кода). (см. GitHub Docs)

## 5) Воронка/статусы (типовой для 1–3 чел.)

Рекомендуемая «фаза» (Status):

```
Backlog → Ready → In progress → Review → Done
```

Поменять статус можно перетаскиванием карточки между колонками board (колонка = значение поля). (см. GitHub Docs)

## 6) Автоматизации

В Projects есть готовые workflow-автоматы (в UI: Workflows):

- Auto-add: ловить новые issues по фильтрам (например, `label:feature`) и автоматически добавлять в проект. (см. GitHub Docs)
- Built-in: менять Status при закрытии задачи, и т.п. (встроенные автоматизации Projects).

Также:

- Закрывайте задачи ключевыми словами в PR (`Fixes #123`, `Closes #123`) — issue закроется при merge. (см. GitHub CLI)

## 7) Минимальные правила качества (PR/ветки)

- Защита ветки (Settings → Branches → Branch protection rules): требовать PR для `main`, количество аппрувов, статусы CI. (см. GitHub Docs)
- Ревью: включить «required reviews», опционально — «require review from Code Owners». (см. GitHub Docs)

## 8) Ежедневная рутина Lead/PM (ad‑hoc)

- Еженедельная итерация: создайте поле Iteration (1 неделя), заведите вид Board (group by Iteration) — видно нагрузку по неделям. (см. GitHub Docs)
- Grooming/Triage: новые тикеты получают Priority, Estimate, Status=Ready.
- Dev‑поток из задачи:

```bash
# создать/привязать ветку к issue и переключиться на неё
gh issue develop 123 --name feat/auth-reset --checkout
```

Позже `gh pr create` — PR с автоссылкой на issue. (см. GitHub CLI)

- Еженедельный апдейт статуса проекта (On track/At risk + dates) — через панель проекта. (см. GitHub Docs)

## 9) Шпаргалка CLI (самое частое)

```bash
# Issues
gh issue create -t "<title>" -b "<body>" -l "bug,P1" -a <user>
gh issue list -s all -L 50
gh issue edit <num> --add-assignee <user> --remove-label "P2" --add-label "P1"

# Projects
gh project create --owner @me --title "Web App"
gh project field-create <PROJ> --owner @me --name "Status" \
  --data-type SINGLE_SELECT --single-select-options "Backlog,Ready,In progress,Review,Done"
gh project item-add <PROJ> --owner @me --url https://github.com/<o>/<r>/issues/123
# узнать/менять значения полей по item-id/field-id
gh project item-list <PROJ> --owner @me
gh project field-list <PROJ> --owner @me
gh project item-edit --id <ITEM_ID> --project-id <PROJ_ID> \
  --field-id <FIELD_ID_STATUS> --single-select-option-id <OPTION_ID_DONE>

# Команда (через REST → gh api)
gh api -X PUT repos/<owner>/<repo>/collaborators/<username> -f permission=push
gh api -X DELETE repos/<owner>/<repo>/collaborators/<username>
```

(см. GitHub CLI / GitHub Docs)

---

## Быстрый старт (минимум кликов)

1. Создайте проект: `gh project create …` и поля `Status/Priority/Estimate`. (см. GitHub CLI)
2. Включите авто‑добавление issues по фильтрам (labels). (см. GitHub Docs)
3. Создайте templates + labels, набросайте бэклог `gh issue create` и добавьте в проект `gh project item-add`. (см. GitHub CLI)
4. Настройте защиту веток и CODEOWNERS. (см. GitHub Docs)
5. Работайте по колонкам `Backlog/Ready/In progress/Review/Done`; PR закрывают задачи ключевыми словами. (см. GitHub Docs / GitHub CLI)

---

## Важно: избегаем частых ошибок команд

- Classic Projects устарели: не используйте `repos/<owner>/<repo>/projects` и API колонок/карт. Вместо этого — Projects v2:
  - `gh project create --owner <owner> --title "..."`
  - `gh project field-create <PROJECT_NUMBER> --owner <owner> --name "Status" --data-type SINGLE_SELECT --single-select-options "Backlog,Ready,In progress,Review,Done"`
  - `gh project item-add <PROJECT_NUMBER> --owner <owner> --url <issue_url>`

- `gh issue create` не поддерживает `--json` на вывод: команда возвращает URL созданной задачи. В PowerShell можно получить номер так:
  - `$url = gh issue create -R <owner>/<repo> -t "Title" -b "Body" -l "bug"`
  - `$num = [int]($url.Trim() -replace '.*/','')`

- Если `gh api` ругается на `-R`: используйте полный путь endpoint без `-R`:
  - Добавить коллаборатора: `gh api -X PUT repos/<owner>/<repo>/collaborators/<username> -f permission=maintain`

- Добавление в Project v2 делается по URL задачи: `gh project item-add <PROJECT_NUMBER> --owner <owner> --url https://github.com/<owner>/<repo>/issues/<num>`

## Комментарии к Issues

### Читать (в т.ч. как JSON)

В терминале с выводом всех комментариев:

```bash
gh issue view 123 --comments
```

Структурированный вывод:

```bash
gh issue view 123 --json comments \
  --jq '.comments[] | {author: .author.login, body: .body, createdAt}'
```

`gh issue view` поддерживает флаг `--comments`, а также `--json comments` и `--jq` для выборки полей. (см. GitHub CLI)

### Добавлять / редактировать / удалять

1. Одной строкой

```bash
gh issue comment 123 -b "Готово ✅, деплой ушёл"
```

2. Многострочно из файла

```bash
gh issue comment 123 -F ./comment.md
```

3. Открыть редактор

```bash
gh issue comment 123 --editor
```

4. Быстро поправить/удалить свой последний комментарий

```bash
gh issue comment 123 --edit-last
gh issue comment 123 --delete-last --yes
```

5. В браузере (если так удобнее набрать форматирование)

```bash
gh issue comment 123 --web
```

Опции `-b/--body`, `-F/--body-file`, `--editor`, `--edit-last`, `--delete-last`, `--web` — из официального мануала `gh issue comment`. (см. GitHub CLI)

#### (Расширенно) Списки комментариев через REST API / `gh api`

Все комментарии конкретного issue:

```bash
gh api repos/<owner>/<repo>/issues/123/comments
```

Все комментарии по репозиторию (issues и PR как issues):

```bash
gh api repos/<owner>/<repo>/issues/comments
```

Это обёртка над REST Issues Comments. (см. GitHub Docs)

---

## Комментарии к Pull Requests

### Читать (комментарии к PR и отзывы review)

Быстрый просмотр в терминале:

```bash
gh pr view 45 --comments
```

Как JSON (например, вывести авторов последних отзывов):

```bash
gh pr view 45 --json comments,reviews \
  --jq '{comments: [.comments[].author.login], reviews: [.reviews[].author.login]}'
```

`gh pr view` поддерживает `--comments` и `--json comments,reviews`. Учтите, что «инлайн» комментарии к строкам диффа могут выводиться не полно в `--comments`; для них используйте REST Pull Request Review Comments. (см. GitHub CLI / GitHub Docs)

### Добавлять обычные комментарии и review-комментарии

Обычный комментарий в обсуждение PR:

```bash
gh pr comment 45 -b "Проверил секцию авторизации — ок"
```

Многострочно/из файла/через редактор:

```bash
gh pr comment 45 -F review_notes.md
gh pr comment 45 --editor
```

Комментарий в рамках Review (approve / comment / request changes):

```bash
gh pr review 45 --comment -b "Нужно вынести константы"
gh pr review 45 --approve
gh pr review 45 --request-changes -b "Покрой тестами edge-cases"
```

Опции для `gh pr comment` и `gh pr review` — см. мануалы. Привязка комментария к конкретной строке диффа из `gh` напрямую не поддерживается — для «инлайн» нужен REST API (или веб-интерфейс).
