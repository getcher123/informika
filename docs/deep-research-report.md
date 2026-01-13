# Отчёт по глубокому исследованию проекта (READ ONLY)

Формат: после каждого пункта чеклиста фиксируется короткий отчёт (что сделано, что найдено, ключевые пути/ссылки).

## 1. Предподготовка
- Сделано: прочитаны `docs/tech-spec-F1.md`, `docs/tech-spec-F2.md`, `docs/informika-extended-tz.md`, `docs/bitrix-docs-new/docs/AGENT.md`.
- Найдено: требования Ф1/Ф2 и расширенное ТЗ; правила поиска Bitrix API/REST в локальном vault.
- Ссылки: `docs/tech-spec-F1.md`, `docs/tech-spec-F2.md`, `docs/informika-extended-tz.md`, `docs/bitrix-docs-new/docs/AGENT.md`.

## 2. Доступ по SSH и рабочий путь
- Сделано: проверен вход по ключу и доступ к `/var/www/u3305923/data/www`.
- Найдено: рабочий каталог пользователя `/var/www/u3305923/data`, каталог сайтов доступен.
- Команды: `ssh -i ~/.ssh/informika_hosting_ed25519 ...`, `ls -ld /var/www/u3305923/data/www`.

## 3. Доступ к MySQL (read-only)
- Сделано: проверен вход в MySQL без пароля через автологин, выбранна БД `u3305923_default`.
- Найдено: база доступна; таблица `b_user` присутствует (типовая Bitrix).
- Команды: `mysql -D u3305923_default -e "SELECT DATABASE() AS db; SHOW TABLES LIKE 'b_user';"`.

## 4. Базовая информация окружения
- Сделано: снята версия PHP и количество модулей; проверен `bitrix/.settings.php` на наличие секции update (совпадений не найдено).
- Найдено: PHP 8.2.28 CLI, 57 модулей; строк с `update` в `bitrix/.settings.php` не обнаружено.
- Команды: `php -v | head -n 1`, `php -m | wc -l`, `grep -n "update" bitrix/.settings.php`.

## 5. Структура каталогов сайтов
- Сделано: снят список каталогов в `~/www`.
- Найдено: домены `crm.innovatika-mosoblgaz.ru`, `innovatika-mosoblgaz.ru`; архив `.git.bak`.
- Команда: `ls -la ~/www`.

## 6. Симлинки витрины
- Сделано: проверены симлинки `bitrix`, `local`, `upload` в витрине.
- Найдено: все три симлинка указывают на CRM-инстанс в `crm.innovatika-mosoblgaz.ru`.
- Команда: `readlink -f bitrix local upload`.

## 7. Список PHP-файлов витрины и ЛК
- Сделано: собран список PHP-страниц в корне витрины и в `lk/` с глубиной до 3.
- Найдено: ключевые публичные страницы (`index.php`, `form.php`, `detail.php`, `idea_detail.php`, `join-team-form.php`, `projects/index.php`, `innovations/index.php`, `ideas/detail.php`) и полный набор ЛК/стейкхолдерских маршрутов (включая `lk/stakeholder/*`).
- Команды: `find . -maxdepth 2 -type f -name "*.php" | sort`, `find lk -maxdepth 3 -type f -name "*.php" | sort`.

## 8. Интеграции/конфиги витрины (поиск по ключевым словам)
- Сделано: выполнен поиск файлов, где упоминаются `Bitrix|curl|api|token|webhook|rest` без вывода содержимого строк.
- Найдено: потенциальные точки интеграции — `lk/includes/bitrix_api.php`, `lk/stakeholder/bitrix-autologin.php`, `lk/cron/check-notifications.php`, а также ряд страниц ЛК/форм (`lk/idea/*`, `lk/applications.php`, `form.php`, `join-team-form.php`, `add.php`, `index.php`).
- Команда: `rg -l ...` / `grep -R -l -E ...`.

## 9. Проверка ассетов витрины
- Сделано: найдены файлы, ссылающиеся на `/local/templates/in_studio_landing/assets`, и проверено наличие ассетов в CRM-шаблоне.
- Найдено: ссылки на ассеты встречаются в `add.php`, `form.php`, `index.php`, `join-team-form.php`, `privacy-policy.php`, `lk/header*.php`, `lk/login.php`, `lk/register.php`, `lk/stakeholder/*` и др. В CRM-шаблоне ассеты присутствуют: `local/templates/in_studio_landing/assets/{css,js,img,fonts}`.
- Команды: `rg -l "/local/templates/in_studio_landing/assets" ...`, `ls -la local/templates/in_studio_landing/assets`.

## 10. Кастомные директории CRM (modules/components/templates)
- Сделано: перечислены каталоги кастомных модулей, компонентов и шаблонов.
- Найдено: модуль `local/modules/eva.lk`, компоненты `local/components/eva` и `local/components/eva.lk`, шаблон `local/templates/in_studio_landing`.
- Команды: `ls -la local/modules`, `ls -la local/components`, `ls -la local/templates`.

## 11. Модуль `eva.lk` (структура и привязки)
- Сделано: снята структура модуля и поиск его упоминаний в `local/`.
- Найдено: в модуле есть компоненты `lk.applications`, `lk.auth`, `lk.layout`, `lk.messages`, `lk.profile`, а также `lib/{api,applications,notifications,user}.php`, `install/*`, `include.php`, `options.php`. Упоминания `eva.lk` встречаются внутри модуля и дублируются в `local/components/eva.lk/*`.
- Команды: `find local/modules/eva.lk -maxdepth 3 -type f | sort`, `rg -l "eva\\.lk" local`.

## 12. Шаблон `in_studio_landing`
- Сделано: зафиксирована структура шаблона и ассетов.
- Найдено: корневые файлы `header.php`, `footer.php`, `description.php`, логотипы; ассеты в `assets/{css,js,img,fonts}`, включая `assets/css/pages`; компоненты в `components/bitrix/*`; локализация `lang/{ru,en}`.
- Команды: `find local/templates/in_studio_landing -maxdepth 2 -type d`, `find .../assets -maxdepth 3 -type d`, `ls -la local/templates/in_studio_landing`.

## 13. `bitrix/php_interface` и `.settings.php` (без секретов)
- Сделано: проверены файлы `bitrix/php_interface`, наличие `.settings.php`, извлечены ключи конфигурации без значений.
- Найдено: в `php_interface` есть `after_connect_d7.php`, `dbconn.php`, `include/`; в `.settings.php` есть ключи `pull*`, `utf_mode`, `cache_flags`, `cookies`, `exception_handling`, `crypto`, `connections`, `sites`. Коннекты: `value`, `readonly` (без вывода параметров).
- Команды: `ls -la bitrix/php_interface`, `ls -la bitrix/.settings.php`, `php -r "... array_keys(...)"`.

## 14. Бизнес‑логика и автоматика в CRM (поиск по файлам)
- Сделано: выполнен поиск файлов с упоминаниями `Add|Update|EventManager|REST` и `CAgent|Agent` (без вывода содержимого).
- Найдено: найденные файлы по ключевым словам — `local/modules/eva.lk/lib/user.php`, `local/components/eva/idea.detail.page/ajax/join_team.php`, `local/components/eva/idea.detail.page/templates/.default/template.php`, `local/components/eva/lk.profile/class.php`, `local/components/eva/auth.register/class.php`. Упоминания `CAgent|Agent` в `local/` и `bitrix/php_interface` не обнаружены.
- Команда: `rg -l "Add|Update|EventManager|REST" ...`, `rg -l "CAgent|Agent" ...`.

## 15. База данных (READ ONLY): смарт‑процессы, HL‑блоки, инфоблоки, кастомные таблицы
- Сделано: выполнены SELECT/SHOW/DESCRIBE к метаданным БД.
- Найдено:
  - Таблица `b_crm_dynamic_type` существует; найдено 5 типов (ENTITY_TYPE_ID: `36`, `31`, `1036`, `1044`, `1048`), таблицы `b_crm_dynamic_items_*`.
  - HL‑блоки: есть `b_hlblock_entity` с записью `ProductMarkingCodeGroup` → `b_hlsys_marking_code_group`.
  - Инфоблоки присутствуют, включая `in_reviews_s2`, `in_portfolio_s2`, `in_reviews_s3`, `in_portfolio_s3` (тип `in_studio_landing_*`).
  - Кастомные таблицы вне `b_*`: `notification_tracking`, `notifications`.
- Команды: `SHOW TABLES LIKE ...`, `DESCRIBE b_crm_dynamic_type`, `SELECT ... FROM b_crm_dynamic_type`, `SELECT ... FROM b_hlblock_entity`, `SELECT ... FROM b_iblock`, `SELECT table_name FROM information_schema.tables ...`.

## 16. Соответствие Ф1/Ф2 требованиям (сущности/статусы/маршруты)
- Сделано: сопоставлены сущности и статусы через БД (смарт‑процессы) и маршруты ЛК/витрины по именам файлов.
- Найдено:
  - Смарт‑процессы: `Запрос на инновацию` (ENTITY_TYPE_ID `1036`), `Идеи` (`1044`), `Заявки в команду` (`1048`) — соответствуют Ф1/Ф2.
  - Статусы: для запросов `Черновик → На сборе идей → Закрыт` (есть `Провал`); для идей `Черновик → На модерации → На доработке → На рассмотрении → Одобрена → Архив / Отклонен`; для заявок в команду `На рассмотрении → Запрошено/Принято/Отклонено`.
  - Маршруты ЛК: `lk/idea/add.php`, `lk/idea/edit.php`, `lk/applications.php`, `lk/stakeholder/*` (портфель, запросы, админ‑панель, карточки).
  - Публичные формы: `form.php` (запрос), `join-team-form.php` (заявка в команду), `idea_detail.php`/`detail.php` (карточки).
  - Уведомления: есть `lk/cron/check-notifications.php` и таблицы `notifications`/`notification_tracking`.
- Команды: `SELECT ... FROM b_crm_dynamic_type`, `SELECT ... FROM b_crm_status`, `find ... -name "*.php"`.

## 17. Интеграции Bitrix24: REST/webhook и автологин
- Сделано: поиск файлов с упоминанием `webhook|rest` и проверка наличия `bitrix-autologin.php`.
- Найдено: явное упоминание `webhook|rest` — только в `lk/includes/bitrix_api.php`. Файл `lk/stakeholder/bitrix-autologin.php` существует, но прямых ссылок на него в `lk/*.php` не найдено (возможен прямой переход по URL).
- Команды: `rg -l "webhook|rest" lk ...`, `ls -la lk/stakeholder/bitrix-autologin.php`.

## 18. CRM‑логика через Bitrix24 REST (смарт‑процессы)
- Статус: блокер.
- Блокер: отсутствует безопасный способ извлечь REST‑ключ/вебхук без раскрытия секретов из `lk/includes/bitrix_api.php`. REST‑вызовы не выполнялись.
- Следующий шаг: получить от владельца проекта безопасный токен/вебхук или разрешение на просмотр `lk/includes/bitrix_api.php` с редактированием секретов.

## 19. Безопасность и чувствительные данные
- Сделано: поиск файлов с ключевыми словами `PASSWORD|TOKEN|SECRET`, проверка `.htaccess`, обзор прав на `logs` и `php-bin`.
- Найдено:
  - Витрина: `.htaccess` отключает авторизацию Bitrix24 для `/bitrix`, `/upload`, `/local` и делает rewrite на `/index.php`.
  - Потенциальные упоминания секретов (только имена файлов, без контента): `lk/register.php`, `lk/profile.php`, `lk/login.php`, `lk/stakeholder/bitrix-autologin.php`, `auth.php`, `lk/stakeholder/profile.php`.
  - CRM: возможные упоминания секретов в `local/components/eva/auth.register/*`, `local/components/eva/lk.profile/*`, а также лог `local/logs/join_team_debug.log`.
  - Логи: `~/logs` содержит nginx access/error логи по доменам; `lk/logs/notifications.log` крупный (~119MB).
  - `~/php-bin` и `php.ini` доступны пользователю.
- Команды: `sed -n "1,200p" .htaccess`, `grep -R -l -E "PASSWORD|TOKEN|SECRET" ...`, `ls -la ~/logs`, `ls -la lk/logs`, `ls -la ~/php-bin`.

## 20. План восстановления/унификации статики и схемы данных
- Статика (UI):
  - Ассеты уже есть в CRM‑шаблоне `local/templates/in_studio_landing/assets/*` и на них ссылается витрина.
  - План: подтвердить, что витрина использует этот шаблон (путь `/local/...` через симлинк), иначе — подключить шаблон или скопировать ассеты в витрину/шаблон витрины.
  - При расхождениях с мокапами — сверить с `Layouts/Mockups/*` и `docs/www-custom-pages-map.md`, обновить только ассеты, без правок ядра.
- Схема данных (интеграции):
  - Смарт‑процессы: `1036` (Запросы), `1044` (Идеи), `1048` (Заявки в команду). Для интеграций использовать эти ENTITY_TYPE_ID.
  - Статусы брать из `b_crm_status` (ENTITY_ID `DYNAMIC_1036_STAGE_*`, `DYNAMIC_1044_STAGE_*`, `DYNAMIC_1048_STAGE_*`).
  - Дальнейший шаг: через REST/БД получить пользовательские поля (`b_user_field`) для этих сущностей и описать схему обмена.

## Итоговое саммари
- Структура: два сайта в `/var/www/u3305923/data/www` — CRM/Bitrix24 (`crm.innovatika-mosoblgaz.ru`) и витрина/ЛК (`innovatika-mosoblgaz.ru`); витрина использует симлинки на `bitrix/local/upload` CRM.
- Кастом: модуль `local/modules/eva.lk`, компоненты `local/components/eva*`, шаблон `local/templates/in_studio_landing` с ассетами и компонентами.
- Сущности: смарт‑процессы CRM — Запросы (`ENTITY_TYPE_ID 1036`), Идеи (`1044`), Заявки в команду (`1048`); статусы соответствуют Ф1/Ф2.
- Интеграции: в витрине есть `lk/includes/bitrix_api.php` (REST/webhook), `lk/stakeholder/bitrix-autologin.php`; в БД — таблицы `notifications`, `notification_tracking` и крупный `lk/logs/notifications.log`.
- Риски/дыры: не выявлены агенты `CAgent`; возможны секреты в файлах авторизации/профиля; REST‑часть пока не подтверждена.
- Блокеры: выполнение шага REST‑аналитики (п.18) без безопасного доступа к вебхуку/токену.
