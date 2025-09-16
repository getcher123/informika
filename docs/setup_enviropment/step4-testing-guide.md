# Практическое тестирование шага 4

Шаг 4 выполнен корректно, если инструменты форматирования, линтинга и CI проходят без ошибок. Ниже — последовательность, которую можно повторить на чистом окружении.

## 1. Подготовь репозиторий
1. Открой терминал в папке проекта.
2. Обнови ветку `main`:
       git checkout main
       git pull
3. Создай отдельную ветку для проверки, например `test/step4-check`:
       git checkout -b test/step4-check

## 2. Проверь node-зависимости и команды
1. Если папка `node_modules` уже была, удали её вместе с `package-lock.json`, чтобы убедиться в чистой установке:
       rm -rf node_modules package-lock.json
2. Установи зависимости:
       npm ci
   Команда должна завершиться без ошибок — это подтверждает, что `package.json` и `package-lock.json` в порядке.
3. Запусти проверку форматирования без изменений:
       npm run fmt:check
4. Запусти линтеры:
       npm run lint:js
       npm run lint:css
   Оба шага должны завершиться успешно. Если видишь ошибки, прочитай путь к файлу в выводе, исправь и повтори.

## 3. Проверь автоматическое форматирование фронта
1. Создай временную копию файла из `local/` или добавь тестовый `.js`/`.css` файл.
2. Нарочно испорти формат (убери отступы, поменяй кавычки).
3. Запусти автоформат:
       npm run fmt:write
4. Выполни `git status` и убедись, что изменились только те файлы, которые ты специально ломал, и формат исправился.
5. Верни файл назад командой `git checkout -- путь/к/файлу`, чтобы не оставлять мусор.

## 4. Проверь PHP-инструменты
1. Ради чистоты удали `vendor` и `composer.lock`, если они есть:
       rm -rf vendor composer.lock
2. Установи зависимости:
       composer install --no-interaction
3. Запусти проверку стиля PHP:
       composer cs:check
4. Запусти статический анализ:
       composer stan
   Обе команды должны пройти без ошибок. Если phpstan жалуется на Bitrix-классы, проверь, что правило уже добавлено в `ignoreErrors`.

## 5. Убедись, что CI работает в GitHub
1. Создай временный файл для теста:
       echo 'step4 check' > docs/tmp-step4-check.md
2. Зафиксируй изменения и отправь ветку:
       git add docs/tmp-step4-check.md
       git commit -m 'chore: check step4 tooling'
       git push --set-upstream origin test/step4-check
3. Открой Pull Request из этой ветки в `main` и перейди на вкладку Checks. Дождись, когда workflow `CI` завершится зелёным.
   - Задание с PHP (php-cs-fixer и phpstan) должно пройти успешно.
   - Задание с Node-инструментами (prettier, eslint, stylelint) тоже должно быть зелёным.
4. После проверки закрой PR без слияния, удали временный файл и ветку:
       git rm docs/tmp-step4-check.md
       git commit -m 'chore: cleanup step4 check'
       git push
       git checkout main
       git push origin --delete test/step4-check


