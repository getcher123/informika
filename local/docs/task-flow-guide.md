# Полный цикл задачи: от TODO до DONE

Этот гайд поможет тебе пройти весь путь по типовой задаче на примере тестовой задачи — от постановки до PR и перевода статуса в Done. Он рассчитан на начинающего разработчика, без сложных терминов.

## Плагины VS Code (для UI-флоу)

- GitHub Pull Requests and Issues: работа с Issues/PR прямо из VS Code.
- GitLens (опционально): история и навигация по Git.
- Prettier – Code formatter: автоформатирование.
- ESLint / Stylelint: подсветка и исправление нарушений стиля.
- PHP Intelephense, PHP Debug, PHP CS Fixer (опционально): удобнее работать с PHP‑кодом.
- Git Graph (опционально): визуальные ветки.

## Шаг 0. Перед началом работы

- Установи и войди в GitHub CLI (по желанию):
  - `gh auth login`
- Проверь доступы к репозиторию и что ветка по умолчанию — `main`.
- Обнови локальный код:
  - `git clone https://github.com/<owner>/<repo>.git`
  - `cd <repo>`
  - `git pull origin main`

Через VS Code UI:

- Установи расширение «GitHub Pull Requests and Issues» → авторизуйся: F1 → GitHub: Sign in.
- Клонируй репозиторий: Welcome → Clone Repository… (или F1 → Git: Clone) → выбери папку → Open.
- Проверь ветку по умолчанию в статус-баре (низу слева «main»). Обнови: F1 → Git: Pull.

## Шаг 1. Выбери задачу и переведи её в работу
<<<<<<< HEAD

=======
- Наш общий проект (Projects v2): https://github.com/users/getcher123/projects/11
>>>>>>> 5185d65283f68a5ebeb25938f05523805052b992
- Открой список Issues в GitHub и выбери задачу со статусом `Backlog` или `Ready`.
- Поменяй статус на `In progress` в Project (доска) или назначь себя исполнителем в Issue.
- Запомни номер задачи (например, `#19`) и короткое название.

Через VS Code UI:

- Открой вкладку GitHub (иконка Octocat) → Issues → выбери репозиторий → найди нужный Issue.
- Назначь себя Assignee и добавь Label/Project (если поддерживается) или «Open in GitHub» для изменения на доске.

## Шаг 2. Создай рабочую ветку

- Выбираем понятное имя ветки. Пример (фича):
  - `git checkout -b feat/setup-ci-tests`
- Если это исправление бага:
  - `git checkout -b fix/idea-submit-validation`
- Правило: `тип/кратко-о-сущности`. Типы: `feat`, `fix`, `chore`, `docs`, `refactor`.

Через VS Code UI:

- Открой переключатель веток в левом нижнем углу → Create new branch… → назови `feat/setup-ci-tests`.
- Либо F1 → Git: Create Branch.

## Шаг 3. Внеси изменения локально

- Открой проект в VS Code, сделай правки по задаче (например, обнови конфиг CI или измените файл).
- Проверь форматирование и базовые проверки (если настроены):
  - `npm run fmt:write`
  - `npm run lint:js`
  - `npm run lint:css`
  - `composer cs:write`
  - `composer stan`

Через VS Code UI:

- Правь файлы; включи Format on Save и Prettier как форматтер по умолчанию.
- Линтеры: установи ESLint/Stylelint — подсказки и «Quick Fix…» прямо в редакторе.
- Скрипты без терминала: панель NPM Scripts (Explorer → NPM Scripts) → запусти `fmt:write`, `lint:js`, `lint:css`.
- Composer/PhpStan: F1 → Tasks: Run Task (если настроены tasks.json) или через «Run Script» в панеле Composer (расширения по желанию).

## Шаг 4. Создай коммит

- Добавь изменённые файлы:
  - `git add .`
- Напиши понятный коммит по Conventional Commits:
  - `git commit -m "feat(ci): add phpstan to pipeline"`
- Несколько изменений — несколько коммитов (короткие и логичные).

Через VS Code UI:

- Вкладка Source Control (Ctrl/Cmd+Shift+G) → Stage All (плюсик) или пофайлово.
- Введите сообщение коммита в поле сверху, например `feat(ci): add phpstan to pipeline` → Commit.

## Шаг 5. Отправь ветку на GitHub

- Запушь ветку:
  - `git push -u origin feat/setup-ci-tests`
- Если видишь подсказку от Git, следуй ей (иногда просит задать upstream).

Через VS Code UI:

- Кнопка «Publish Branch»/«Push» в статус-баре или Source Control → «Push».

## Шаг 6. Открой Pull Request (PR)

- Через GitHub UI: «Compare & pull request».
- Или через CLI:
  - `gh pr create --base main --head feat/setup-ci-tests --title "feat(ci): add phpstan" --body "Добавлен phpstan, обновлён workflow"`
- Заполни шаблон PR: что сделано, как проверял, скриншоты (если уместно). Свяжи задачу:
  - В тексте PR добавь `Closes #19` (GitHub закроет Issue после мержа).

Через VS Code UI:

- Вкладка GitHub → Pull Requests → Create Pull Request (или F1 → GitHub: Create Pull Request).
- Заполни Title/Description, добавь `Closes #19`. Выбери базовую ветку `main` и свою фич-ветку как head.

## Шаг 7. Переведи статус задачи на PR

- В Project‑доске перетащи карточку задачи в колонку `PR` (или `Review`, если так принято у вас).
- Убедись, что к задаче привязан твой PR (GitHub часто делает это сам, если есть `Closes #…`).

Через VS Code UI:

- Вкладка GitHub → Issues → открой Issue → добавь ссылку на PR или проверь авто‑линк.
- Если нужна смена колонки на Project board — открой Issue → «Open in GitHub» и перемести карточку в браузере.

## Шаг 8. Дождись ревью и подчисти замечания

- Ревьюер оставит комментарии. Исправь и запушь новые коммиты в ту же ветку:
  - `git add . && git commit -m "fix(ci): tweak phpstan config" && git push`
- Статусы CI должны быть зелёными. Если красные — открой вкладку Checks и исправь ошибки.

Через VS Code UI:

- Открой PR во вкладке GitHub → смотри комментарии инлайн, отвечай, помечай resolved.
- Вноси правки, коммить/пушь через Source Control; статусы Checks видно в карточке PR.

## Шаг 9. Мерж в main

- После апрува и зелёного CI — жми «Merge» (или сделает тимлид, в зависимости от правил).
- Убедись, что твой PR попал в ветку `main`.

Через VS Code UI:

- Вкладка GitHub → Pull Requests → выбери свой PR → Merge (Squash/Rebase в зависимости от политики).

## Шаг 10. Переведи статус задачи в Done

- Перетащи карточку на доске в `Done`.
- Проверь, что Issue автоматически закрылся (если в PR был `Closes #19`). Если нет — закрой вручную и добавь комментарий о результате.

Через VS Code UI:

- Вкладка GitHub → Issues → найди Issue → Close Issue (если не закрылся автоматически).
- Для перемещения по Project board при необходимости нажми «Open in GitHub» (перетаскивание — в браузере).

## Шаг 11. Убери ветку (по желанию)

- Локально:
  - `git branch -d feat/setup-ci-tests`
- На GitHub (кнопка «Delete branch» после мержа) или через CLI:
  - `git push origin --delete feat/setup-ci-tests`

Через VS Code UI:

- Переключатель веток в статус‑баре → Manage Branches → удали локальную ветку.
- Вкладка GitHub → Pull Requests → в закрытом PR нажми «Delete branch» (если доступно).

## Короткий пример на тестовой задаче

Допустим, задача: «Добавить php-cs-fixer в CI» (Issue `#19`).

1. В Project — перетащи карточку в `In progress`. Назначь себя.
2. Ветка:
   - `git checkout -b feat/add-php-cs-fixer`
3. Правки: добавь шаги в `.github/workflows/ci.yml` и конфиг `.php-cs-fixer.php`.
4. Коммит:
   - `git add .`
   - `git commit -m "feat(ci): add php-cs-fixer to workflow"`
5. Push:
   - `git push -u origin feat/add-php-cs-fixer`
6. PR:
   - `gh pr create --base main --head feat/add-php-cs-fixer --title "feat(ci): add php-cs-fixer" --body "Closes #19"`
7. Перетащи карточку в `PR` / `Review`.
8. Исправь замечания (если будут), дождись зелёного CI.
9. Merge → PR попал в `main`.
10. Карточка → `Done`, Issue закрыт.

## Полезные советы

- Держи PR маленькими (до ~300 строк diff) — быстрее ревью, меньше конфликтов.
- Один PR — одна законченная мысль. Если задач много — несколько PR.
- Называй ветки понятно: `feat/…`, `fix/…`, `chore/…`.
- Перед PR всегда запускай форматирование и линтеры локально.

## Словарь терминов (очень кратко)

- Issue: задача в GitHub (карточка с описанием).
- Project (доска): наглядный список задач по статусам (колонки: Backlog/Ready/In progress/Review/Done и т.п.).
- Ветка (branch): отдельная линия разработки; чтобы не ломать `main`.
- Коммит (commit): сохранение изменений с комментарием.
- PR (Pull Request): запрос на включение твоей ветки в `main`.
- CI (Continuous Integration): автоматические проверки кода (линтеры, тесты).
- Линтеры/форматтеры: инструменты, которые выравнивают стиль кода и находят ошибки.
- Milestone (веха): срок/этап, к которому мы привязываем задачи.
- Estimate: оценка трудозатрат (очки/часы/дни); не путать с Due date (дедлайн).
