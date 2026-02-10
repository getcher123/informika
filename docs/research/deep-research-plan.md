# План глубокого исследования проекта (Ф1–Ф2)

Цель: понять, как реализованы текущие решения (Bitrix24‑контур и кастомная витрина/ЛК), чтобы безопасно начинать новые интеграции. Используем только SSH к хостингу и локальную техническую документацию (Bitrix vault: `docs/bitrix-docs-new/docs/AGENT.md`). Пометка *(SSH)* значит, что шаг могу выполнить сам по SSH.

- [x] Предподготовка: прочитать `docs/specs/phases/tech-spec-F1.md`, `docs/specs/phases/tech-spec-F2.md`; открыть гайд `docs/bitrix-docs-new/docs/AGENT.md` (локально).
- [x] Проверить доступ по ключу и рабочий путь `/var/www/u3305923/data/www` *(SSH, ключ `~/.ssh/informika_hosting_ed25519`)*.
- [x] Убедиться в доступе к MySQL в режиме read-only: `mysql` (автологин настроен локально в `~/.my.cnf` или `mysql_config_editor`) для базы `u3305923_default` *(SSH + MySQL)*.
- [x] Снять базовую информацию об окружении (версии PHP/Bitrix) без изменений настроек: `php -v`, `php -m`, `grep -n "update" bitrix/.settings.php` *(SSH, READ ONLY)*.
- [x] Снять структуру каталогов сайтов (`ls -la ~/www`, домены `crm.innovatika-mosoblgaz.ru`, `innovatika-mosoblgaz.ru`) *(SSH)*.
- [x] Зафиксировать симлинки витрины (`bitrix`, `local`, `upload`) через `readlink -f` *(SSH)*.
- [x] Обойти витрину/ЛК: список файлов `find . -maxdepth 2 -type f -name "*.php"`, особенно `lk/*` *(SSH)*.
- [x] Найти интеграции/конфиги витрины: `rg -n "Bitrix|curl|api|token" lk include *.php`; просмотр `lk/includes/*.php`, `lk/cron/*` *(SSH)*.
- [x] Проверить подключаемые ассеты витрины (ссылки на `/local/templates/in_studio_landing/assets/...`) и наличие статики в CRM *(SSH)*.
- [x] Обойти CRM/Bitrix24 кастом: `ls local/modules`, `ls local/components`, `ls local/templates` *(SSH)*.
- [x] Изучить модуль `local/modules/eva.lk` (lib, components, install) и привязки в коде (`rg -n "eva.lk" local`) *(SSH)*.
- [x] Изучить шаблон `local/templates/in_studio_landing` (assets/css/js, компоненты) *(SSH)*.
- [x] Проверить `bitrix/php_interface` (`dbconn.php`, `after_connect_d7.php`) и настройки `bitrix/.settings.php` без публикации секретов *(SSH)*.
- [x] Найти бизнес-логику/автоматику в CRM: `rg -n "Add|Update|EventManager|REST" local/modules local/components` и проверки агентов/крона *(SSH)*.
- [x] Исследовать БД в режиме чтения: через `mysql` получить списки кастомных таблиц/HL-блоков/инфоблоков (только SELECT с LIMIT), зафиксировать, где лежат запросы/идеи/заявки *(SSH + MySQL)*.
- [x] Сопоставить реализацию с требованиями Ф1/Ф2: сущности/статусы (запросы, идеи, заявки), маршруты ЛК, формы подачи, уведомления/дедлайны *(SSH + локальные ТЗ)*.
- [x] Проверить интеграции Bitrix24: REST/webhook, автологин (`lk/stakeholder/bitrix-autologin.php`, `local/modules/eva.lk/lib/api.php`), определить способ авторизации (webhook URL/portal домен/ключ) *(SSH)*.
- [ ] Исследовать CRM‑логику через Bitrix24 REST (предпочтительно, без прямого доступа к БД): получить через REST список смарт‑типов/полей/воронок, проверить сущности запрос/идея/заявка в команду, статусы и связи; использовать локальную документацию `docs/bitrix-docs-new/docs/AGENT.md` для методов CRM/REST. *(SSH + REST)*
- [x] Оценить безопасность: поиск секретов (`rg -n "PASSWORD|TOKEN|SECRET"`), правила `.htaccess`, права на `logs/`, `php-bin` *(SSH)*.
- [x] План для восстановления/унификации статики (если ассеты отсутствуют) и схемы данных для новых интеграций *(SSH + локальные ТЗ)*.
- [x] Сформировать отчёт: структура проекта, найденные сущности/интеграции, риски/дыры, чек-лист соответствия Ф1/Ф2, рекомендации по следующим шагам *(локально)*.
