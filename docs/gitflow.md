# Gitflow проекта (Trunk‑Based Development)

## Основы
- Одна основная ветка: `main`.
- Фичи/фиксы — короткоживущие ветки: `feat/<ключ>`, `fix/<ключ>`, `chore/<ключ>`.

## PR‑правила
- Малый объём: до ~300 строк diff.
- Обязательный PR‑шаблон: контекст, скриншоты, чек‑лист.
- Один аппрув от Lead, сам себе не мержим.

## Коммиты
- Стиль Conventional Commits: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`, и т.д.

## Релизы и хотфиксы
- Релизы: теги вида `v0.x.y`, чейнджлог формируется из PR.
- Хотфиксы: ветка `hotfix/<issue>`, быстрый PR → тег `v0.x.y+1`.

## Статусы задач
- Стандартный поток: `Backlog → Ready → In Progress → PR → Review → Staging → Done`.

## Префиксы веток
- `feat/...` — feature: новая функциональность
- `fix/...` — исправление бага
- `docs/...` — документация
- `test/...` — тесты
- `refactor/...` — рефакторинг без изменения поведения
- `chore/...` — «хозяйственные» изменения, которые не влияют напрямую на код продукта, не добавляют функционал и не исправляют баги.

## Примеры веток

### 1. Функциональные (`feat`)
- `feat/requests-create-form` — форма создания запроса на инновацию
- `feat/ideas-catalog-filter` — фильтры и сортировка идей в каталоге
- `feat/project-initiation-card` — карточка проекта при трансформации идеи
- `feat/events-board` — доска событий (конкурсы/хакатоны и др.)
- `feat/profile-skills-tags` — расширение профилей участников с тегами навыков

### 2. Исправления багов (`fix`)
- `fix/idea-submit-validation` — ошибка валидации при подаче идеи
- `fix/project-doc-upload` — исправление загрузки файлов в проекте
- `fix/notifications-email-template` — правки шаблонов уведомлений
- `fix/ui-mobile-layout` — адаптив на мобильных экранах

### 3. Хозяйственные (`chore`)
- `chore/update-bitrix-modules` — обновление зависимостей/модулей Bitrix
- `chore/ci-lint-setup` — настройка линтера и CI
- `chore/repo-cleanup` — очистка `.gitignore`, удаление временных файлов
- `chore/dev-env-docs` — правки документации для разработчиков (README, setup)

### 4. Документация (`docs`)
- `docs/api-endpoints` — описание внутренних API Bitrix‑скриптов
- `docs/user-guide-mvp` — гайд для тестировщиков по Фазе 1

### 5. Рефакторинг (`refactor`)
- `refactor/idea-model` — упрощение структуры сущности «Идея»
- `refactor/project-status-flow` — пересборка статусов проекта без изменения логики
- `refactor/components-split` — разбиение больших Bitrix‑компонентов на модули


## Структура репозитория

В репозитории принята следующая структура (см. комментарии для назначения директорий и файлов):

```
/local/                              # весь прикладной код Bitrix (единственная зона изменений)
  php_interface/
    migrations/                      # файлы миграций sprint.migration (шаг 6)
    migrations.cfg.php               # основной конфиг миграций (доп.: migrations.{NAME}.php)
  modules/
    sprint.migration/                # модуль миграций (под управлением Composer)

/bin/
  migrate                            # консольный алиас для запуска миграций (шаг 6)

/.github/
  ISSUE_TEMPLATE/                    # шаблоны задач
    bug.md
    feature.md
  PULL_REQUEST_TEMPLATE.md           # шаблон PR
  workflows/
    ci.yml                           # CI: линтеры/форматтеры/phpstan/php-cs-fixer (шаг 4)
    deploy_staging.yml               # CD на staging (опционально, шаг 6)
    deploy_prod.yml                  # CD на prod (опционально, шаг 6)

/docs/                               # документация проекта
  README.md
  architecture.md
  task-flow-guide.md
  plan-grafik.md
  gitflow.md
  remote-dev-workflow.md
  system-restore-test-plan.md        # план теста восстановления среды (шаг 6)

/scripts/                            # утилиты/скрипты проекта
  PM/                                # автоматизация Project/Issues (PM-инструменты)
    create-issues-for-lead.ps1       # создание задач для лида/борды
    setup-issues.ps1                 # первичная настройка репо/лейблов/проекта
    add-checklist-to-issues.ps1      # массовое добавление чек-листов в задачи
    issues.ru.json                   # русские тексты задач (UTF-8)
    checklists/
      onboarding.ru.md               # Markdown-чек-лист для задач (UTF-8)

README.md                            # обзор и быстрый старт
CONTRIBUTING.md                      # правила вкладов
CODEOWNERS                           # владельцы областей кода
.editorconfig                        # базовые правила форматирования
.prettierrc.json                     # конфиг Prettier
eslint.config.js                     # конфиг ESLint
stylelint.config.mjs                 # конфиг Stylelint
package.json                         # фронтовые утилиты/скрипты
composer.json                        # PHP-зависимости/скрипты
composer.lock
phpstan.neon                         # статический анализ PHP
.php-cs-fixer.php                    # автоформат PHP
```

Пояснения и рекомендации:
- Рабочая зона — строго `/local/`; системные папки Bitrix не изменяем.
- Миграции структуры (ИБ/HL/UF и пр.) — через `sprint.migration` и `bin/migrate`.
- CD‑файлы в `/.github/workflows/` опциональны и подключаются по готовности окружений.
- Скрипты в `scripts/PM/` требуют GitHub CLI (`gh`) и используются для автоматизации задач/проектов.
