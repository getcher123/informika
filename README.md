# Informika (Инноватика Мособлгаз)

Репозиторий платформы «Инноватика Мособлгаз»: требования (Ф1–Ф3), статические HTML/CSS/JS мокапы, сопроводительная документация и вспомогательные скрипты.

## Документация

- Индекс документации: [docs/README.md](docs/README.md)
- Краткий обзор требований: [docs/specs/overview.md](docs/specs/overview.md)

## Мокапы (Layouts/Mockups)

- Список всех страниц: `Layouts/Mockups/index.html`
- UI‑правила и унификация: `Layouts/Mockups/UNIFICATION_GUIDE.md`
- UI‑kit (демонстрация компонентов): `Layouts/Mockups/ui-kit.html`

Рендер мокапов (брейкпоинты 320/768/1024/1440):

```bash
node scripts/render-mockups.js Layouts/Mockups/<page>.html
```

## Code Quality (линтеры/форматирование)

```bash
# JS/CSS/MD/JSON
npm run lint:all
npm run fmt:all

# PHP
composer cs:check
composer cs:write
composer stan
```

## Примечания

- `docs/bitrix-docs-new/` — большой локальный vault документации Bitrix (используется для поиска справки; без необходимости не трогать).
