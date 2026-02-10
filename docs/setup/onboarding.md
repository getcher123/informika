# Онбординг (кратко)

Цель: быстро настроить рабочее место и понимать, где лежат требования, мокапы и ключевые скрипты.

## 1) Инструменты

- Git
- Node.js (LTS) + npm
- Composer (для PHP‑линтеров)
- VS Code (по желанию) + базовые плагины: ESLint, Prettier, Stylelint, EditorConfig

## 2) Клонирование репозитория

```bash
git clone <repo>
cd <repo>
```

## 3) Проверка качества кода

```bash
npm run lint:all
npm run fmt:all

composer cs:check
composer stan
```

## 4) Документация и источники истины

- Индекс документации: `docs/README.md`
- Требования по фазам: `docs/specs/phases/`
- Макеты: `Layouts/Mockups/index.html`

## 5) Рендер мокапов

```bash
node scripts/render-mockups.js Layouts/Mockups/<page>.html
```
