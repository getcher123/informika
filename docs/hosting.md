# Хостинги

Сводные характеристики проверенных площадок для развёртывания системы. Информация используется при выборе среды и планировании доступа.

## Хостинг №1

**Площадка и доступ**
- AlmaLinux 8.10 (Cerulean Leopard) с ядром 4.18.0-553.58.1.el8_10.x86_64; SELinux отключён.
- Shell-доступ выдан пользователю `u3305923` (группы `u3305923`, `mgrsecure`); прав суперпользователя нет, системные логи (`/var/log/messages`) и конфигурации Apache недоступны.

**Вычислительные ресурсы**
- CPU: 2×10‑ядерный Intel Xeon E5-2630 v4 (40 потоков, 2.2–3.1 ГГц).
- RAM: 128 ГБ (≈43 ГБ занято, 33 ГБ свободно, кеш/буферы ≈52 ГБ); swap 8 ГБ (занято ~3.2 ГБ).
- Диски: LVM `store-root` 3.4 ТБ (раздел `/`, свободно ≈2 ТБ) и отдельный `/boot` 1 ГБ; дисковые квоты для пользователя не активированы.

**Сеть и службы**
- `eth0` c адресом 31.31.196.9/24 и пулом /32 (95.163.239.223, 194.67.96.42, 151.248.127.233 и др.), IPv6 `2a00:f940:2:2:1:1:0:262/65`.
- `eth1` — внутренний 10.30.7.11/16 с маршрутами на 10.42.12.0/24 и 10.91.0.0/24; шлюз 31.31.196.1.
- Порты: веб (80/443, 8080/8081), почта (25/465/587/110/143/993/995), FTP (21), SSH (22), DNS (53), MySQL `127.0.0.1:3306`, вспомогательные сервисы (1500, 2134, 4747, 5000, 783, 9100‑9117, 9900 и др.).

**ПО и окружение**
- nginx 1.19.6, Apache 2.4.37, плюс `httpd2` и `ihttpd` (ISPmanager); логи nginx недоступны.
- PHP 8.2.28 CLI с ionCube, модульный набор без bcmath/gmp; лимиты `memory_limit=128M`, `upload_max_filesize=2M`.
- MySQL 8.0.25-15 (Percona) и `mysql57` (Percona 5.7) одновременно; PostgreSQL нет.
- Node.js 10.24.0 / npm 6.14.11, Python 3.8.6; Composer отсутствует.

**Политики и автоматизация**
- ulimit: `-t 900`, `-u 36`, `-n 512`, `-m 262144`, `-l 64` — ограничения для длительных CLI-процессов.
- Активны Fail2ban и cron-задачи reg.ru (очистка PHP-сессий, проверки Bitrix, антивирусные и обслуживающие скрипты).

**Выводы**
- Ресурсов достаточно для размещения сервиса, но среда shared; управление сайтами и SSL через ISPmanager.
- Для работы нужны доступы ISPmanager/SSH/MySQL и пути к логам; при необходимости ставим Composer/новый Node.js в домашний каталог.
- SSH подключение: `ssh u3305923@server262.hosting.reg.ru` (31.31.196.9), fingerprint ED25519 `SHA256:hdJuUWGdfjhycWB87L/NfapcPT3Malhmc0vrC31CMq8`. При первом коннекте добавляется в known_hosts, требуется пароль пользователя.
- Доступные CLI версии (рег.ру): PHP `php52 … php85` (включая `php83` и ioncube-варианты), Python `python2.7`, `python3.4`, `python3.5`, `python3.7–3.10`. Примеры: `php70 -v`, `python2.7`.
- Домашние директории: `~/bin-tmp`, `~/email`, `~/logs`, `~/mail.log`, `~/php-bin*`, `~/tmp`, `~/www` (сайтовые каталоги `crm-innovatika-mosoblgaz.ru`, `crm.innovatika-mosoblgaz.ru`, `innovatika-mosoblgaz.ru`).
- Резервная копия сайта `crm.innovatika-mosoblgaz.ru` сохранена в `/backups/crm.innovatika-mosoblgaz.ru`.
- Резервная копия сайта `innovatika-mosoblgaz.ru` сохранена в `/backups/innovatika-mosoblgaz.ru`.
- Инцидент: после удаления папки `crm-innovatika-mosoblgaz.ru` (в ней был DocumentRoot/обложка) сайт `innovatika-mosoblgaz.ru` начал отдавать `mod_fcgid: error reading data from FastCGI server / End of script output before headers`, так как веб-сервер больше не находил ядро/точку входа; требуется восстановление корня или корректный DocumentRoot.
- Инцидент: массовый запуск потоков `~/.vscode-server` (Remote-SSH) превысил лимит 36 процессов на тарифе Host, из-за чего появлялась 500 ошибка при открытии сайта. Решение: завершить процессы VS Code (`pkill -f ".vscode-server"`), при необходимости удалить кеш `rm -rf ~/.vscode-server`, впредь корректно закрывать Remote-SSH/не держать много одновременных сессий.
- Журналы: веб-логи в `~/logs` (`crm.innovatika-mosoblgaz.ru.access.log/error.log`, `innovatika-mosoblgaz.ru.access.log/error.log` и архивы). Пользовательский PHP-лог из ini пишется в `/var/www/u3305923/data/logs/phperr.log`; системные логи nginx недоступны.
- Настройки веб/PHP: режим FastCGI (Apache) с PHP 8.3.27 для `crm.innovatika-mosoblgaz.ru`; `Loaded Configuration File` по phpinfo: `/var/www/php-bin/u3305923/innovatika-mosoblgaz.ru/php.ini`. В ini заданы `upload_max_filesize=256M`, `post_max_size=256M`, `max_execution_time=300`, `log_errors=On`, `error_log=/var/www/u3305923/data/logs/phperr.log`, `upload_tmp_dir=/var/www/u3305923/data/tmp`; настройки применяются (phpinfo/тестовая ошибка в логах). `/tmp` — tmpfs 8 ГБ, занято ~1%.
- Тест загрузки: простая страница `upload-test.php` в корне CRM сохраняет файл успешно (error=0), значит права/лимиты и tmp работают. В боевом Bitrix smart-процессе загрузки AJAX видны предупреждения `a client request body is buffered to a temporary file` и ошибка `upstream prematurely closed connection`/`mod_fcgid: ap_pass_brigade failed…` — подозрение на тайм-ауты/буферы nginx→Apache/mod_fcgid (`client_max_body_size`, `client_body_buffer_size`, `proxy_read_timeout`, `FcgidIOTimeout`). Требуется настройка на стороне веб-сервера.

## Хостинг №2

**Площадка и доступ**
- AlmaLinux 8.10 с ядром 4.18.0-553.47.1.el8_10.x86_64; uptime 215 дней, `systemctl` сообщает *degraded* (1 failed unit).
- Пользователь `u3178812` (группа `mgrsecure`) без sudo; нет доступа к `/var/log/wtmp`, конфигам nginx/httpd.

**Вычислительные ресурсы**
- CPU: 2×8‑ядерный Intel Xeon E5-2670 (32 потока, 2.6–3.3 ГГц).
- RAM: 128 ГБ (≈52 ГБ занято, 43 ГБ свободно, кеш ≈33 ГБ); swap 8 ГБ (занято ~2.6 ГБ).
- Диски: `/dev/sda3` 3.5 ТБ (занято 0.86 ТБ), `/boot` 974 МБ; квоты отключены.

**Сеть и службы**
- `eth0` — 31.31.197.15/24 + пул /32 (95.163.239.8, 188.93.212.196, 31.31.206.148 и др.), IPv6 `2a00:f940:2:2:1:1:0:279/65`.
- `eth1` — 10.30.7.28/16, маршруты на 10.42.12.0/24 и 10.91.0.0/24; шлюз 31.31.197.1.
- Порты: веб (80/443, 8080/8081), почта (25/465/587/110/143/993/995), FTP (21), SSH (22), DNS (53), MySQL `127.0.0.1:3306`, служебные 9983/10001/1500/2134/4747/9100‑9117 и др.

**ПО и окружение**
- nginx 1.19.6, Apache 2.4.37, плюс `httpd2` и `ihttpd` (ISPmanager); логи nginx недоступны.
- PHP 8.2.28 CLI с ionCube, модульный набор без bcmath/gmp; лимиты `memory_limit=128M`, `upload_max_filesize=2M`.
- MySQL 8.0.25-15 (Percona) и `mysql57` (Percona 5.7) одновременно; PostgreSQL нет.
- Node.js 10.24.0 / npm 6.14.11, Python 3.8.6; Composer отсутствует.

**Политики и автоматизация**
- ulimit аналогичен №1: `-t 900`, `-u 36`, `-n 512`, `-m 262144`, `-l 64`.
- Fail2ban, incrond, набор reg.ru cron/служб (hack-notify, fcgi_reload, isp_handler, prometheus exporters); присутствуют пользовательские python-боты.

**Выводы**
- Параметры сопоставимы с хостингом №1, но сервер нагружен множеством клиентских сервисов (Passenger, proftpd, node).
- Требуются доступы ISPmanager/SSH/MySQL и повышение лимитов PHP (128M/2M) при развёртывании. Стоит уточнить причину degraded-состояния и синхронизацию инстансов MySQL.
