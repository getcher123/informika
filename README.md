## 🚀 Code Quality & Linting

Проект использует автоматические проверки кода через GitHub Actions:

- **PHP**: `php-cs-fixer`, `phpstan`
- **JS/CSS/MD/JSON**: `eslint`, `stylelint`, `prettier`, `markdownlint`, `jsonlint`

### 🔧 Локальные команды

```bash
# PHP
composer cs:check     # Проверка форматирования
composer cs:write     # Автоформатирование
composer stan         # Статический анализ

# JS/CSS/MD/JSON
npm run lint:all      # Проверка форматирования и линтинга
npm run fmt:all       # Автоформатирование
```
