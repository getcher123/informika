# Развёртывание BitrixVM и восстановление бэкапа с двумя сайтами на одном ядре

## 0. Требования
- Образ BitrixVM 9.x (AlmaLinux 9).
- Ресурсы VM: ≥ 4 vCPU, ≥ 8 ГБ RAM, ≥ 60 ГБ диска, сеть в режиме Bridged.
- Доступ к файлам бэкапа: архив `*.tar.gz` (возможны многочастные) + `restore.php`.
- Локальный ПК с Windows, PowerShell, OpenSSH, VS Code (Remote Development).

## 1. Первичный запуск BitrixVM
1. Загрузите VM; войдите под `root` (пароль задаётся при первой загрузке).
2. Запустите меню `/root/menu.sh`.
3. Поменяйте пароль пользователя `bitrix` и установите корректный часовой пояс.
4. При необходимости снимите snapshot VM (точка отката перед дальнейшими настройками).

## 2. Настройка сети и SSH
1. Зафиксируйте статический IP:
   ```bash
   nmtui  # Edit a connection → выберите eth0 → IPv4 → Manual
   ```
   - IP: `192.168.100.172/24` (пример).
   - Gateway: `192.168.100.1`.
   - DNS: `8.8.8.8` (или корпоративный).
2. На локальной машине добавьте запись в `hosts`:
   ```
   192.168.100.172 innov.local
   ```
3. Сгенерируйте SSH-ключ на Windows:
   ```powershell
   ssh-keygen -t ed25519
   ```
4. Скопируйте ключ пользователю `bitrix` и `root`:
   ```powershell
   type $env:USERPROFILE\.ssh\id_ed25519.pub |
     ssh bitrix@192.168.100.172 "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"

   type $env:USERPROFILE\.ssh\id_ed25519.pub |
     ssh root@192.168.100.172 "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"
   ```
5. В `~/.ssh/config` добавьте:
   ```
   Host bitrix-vm
       HostName 192.168.100.172
       User bitrix
       IdentityFile ~/.ssh/id_ed25519

   Host bitrix-vm-root
       HostName 192.168.100.172
       User root
       IdentityFile ~/.ssh/id_ed25519
   ```
6. Подключитесь по SSH и через VS Code (Remote SSH) к `/home/bitrix`.

## 3. Создание пула и основного сайта
1. `/root/menu.sh` → «Управление пулом» → «Создать пул» → режим *Single* (оставьте nginx/php/mysqld включёнными).
2. `/root/menu.sh` → «Управление веб-сайтами» → «Создать сайт».
   - Тип: `kernel`.
   - Домен: `innov.local`.
   - DocumentRoot: `/home/bitrix/ext_www/innov.local`.
   - Cron: `y`.
3. Пропишите `innov.local` в `hosts`, откройте `http://innov.local/`, пройдите установку Bitrix.

## 4. Загрузка бэкапа
1. Переместите файлы в корень сайта (рядом с `restore.php`):
   ```powershell
   scp backup-01.tar.gz root@192.168.100.172:/home/bitrix/ext_www/innov.local/
   scp restore.php root@192.168.100.172:/home/bitrix/ext_www/innov.local/
   ```
   Если бэкап состоит из нескольких частей (`.tar.gz`, `.tar.gz.1`, `.tar.gz.2`, …) — загрузите **все** файлы в корень сайта. `restore.php` увидит их автоматически, объединять вручную не нужно.
2. Выдайте права:
   ```bash
   chown bitrix:bitrix /home/bitrix/ext_www/innov.local/restore.php
   chmod 644 /home/bitrix/ext_www/innov.local/restore.php
   ```
3. Чтобы избежать ошибки 413, добавьте в `/etc/nginx/bx/site_enabled/bx_ext_innov.local.conf` строку `client_max_body_size 2048m;`, затем:
   ```bash
   nginx -t
   systemctl reload nginx
   ```

## 5. Восстановление ядрового сайта (innov.local)
1. В `restore.php` сразу после `<?php` добавьте:
   ```php
   define('NO_CHECK_IP', true);
   ```
2. Откройте `http://innov.local/restore.php`, выберите «Загрузить с локального диска», затем ссылку «Архив уже загружен».
3. В списке выберите `backup.tar.gz`.
4. На шаге БД оставьте параметры из `.settings.php` (`localhost / userinnov / dbinnov`) и нажмите «Восстановить».
5. По завершении:
   ```bash
   rm -f /home/bitrix/ext_www/innov.local/restore.php
   mkdir -p /home/bitrix/ext_www/innov.local/bitrix/{cache,managed_cache,stack_cache,html_pages}
   chown -R bitrix:bitrix /home/bitrix/ext_www/innov.local/bitrix
   ```
6. Если после восстановления появляются ошибки из-за отсутствующих таблиц:
   - Найдите SQL-файл/часть в бэкапе (`*.sql`, `*.sql.gz`).
   - Восстановите вручную:
     ```bash
     gunzip -c backup.sql.gz | mysql -u userinnov -p dbinnov
     ```
     (используйте логин/пароль из `.settings.php`).
7. При появлении предупреждений о кэше создайте каталоги и сбросьте их:
   ```bash
   rm -rf /home/bitrix/ext_www/innov.local/bitrix/cache/*
   rm -rf /home/bitrix/ext_www/innov.local/bitrix/managed_cache/*
   rm -rf /home/bitrix/ext_www/innov.local/bitrix/stack_cache/*
   rm -rf /home/bitrix/ext_www/innov.local/bitrix/html_pages/*
   ```

## 6. Создание ссылочного сайта (s3) из бэкапа
1. В бэкапе появится каталог `bitrix/backup/sites/s3` (название = SITE_ID).
2. `/root/menu.sh` → «Управление веб-сайтами» → «Создать сайт».
   - Тип: `link`.
   - Путь к ядру: `/home/bitrix/ext_www/innov.local`.
   - DocumentRoot: `/home/bitrix/ext_www/s3`.
   - Cron можно пропустить.
3. Скопируйте файлы сайта:
   ```bash
   sudo -u bitrix cp -a /home/bitrix/ext_www/innov.local/bitrix/backup/sites/s3/. /home/bitrix/ext_www/s3/
   chown -R bitrix:bitrix /home/bitrix/ext_www/s3
   ```
4. Создайте симлинки на общее ядро:
   ```bash
   cd /home/bitrix/ext_www/s3
   rm -rf bitrix local upload
   ln -s /home/bitrix/ext_www/innov.local/bitrix bitrix
   ln -s /home/bitrix/ext_www/innov.local/local local
   ln -s /home/bitrix/ext_www/innov.local/upload upload
   ```

## 7. Настройка nginx и портов
1. Откройте `/etc/nginx/bx/site_enabled/bx_ext_innov.local.conf`:
   ```nginx
   listen 80;
   server_name innov.local;
   ```
2. Откройте `/etc/nginx/bx/site_enabled/bx_link_s3.conf`:
   ```nginx
   listen 8080;
   server_name s3.local;
   server_name_in_redirect off;
   ```
3. Проверьте и перезагрузите nginx:
   ```bash
   nginx -t
   systemctl reload nginx
   ```
4. На локальном ПК добавьте в `hosts`:
   ```
   192.168.100.172 s3.local
   ```
   Сайт будет доступен по `http://s3.local:8080/`.

## 8. Привязка сайтов в Bitrix
1. Перейдите в `/bitrix/admin/site_admin.php`.
   - `innov.local`: домен `innov.local`, каталог `/`.
   - `s3`: домен `s3.local:8080`, каталог `/`.
2. В `/home/bitrix/ext_www/innov.local/bitrix/php_interface/dbconn.php` добавьте выбор SITE_ID:
   ```php
   if ($_SERVER['HTTP_HOST'] === 's3.local:8080') {
       define('SITE_ID', 's3');
   } else {
       define('SITE_ID', 's1');
   }
   ```
3. Очистите кэши:
   ```bash
   rm -rf /home/bitrix/ext_www/innov.local/bitrix/cache/*
   rm -rf /home/bitrix/ext_www/innov.local/bitrix/managed_cache/*
   ```

## 9. Проверка и финализация
1. Проверьте доступность:
   - `http://innov.local/`
   - `http://s3.local:8080/`
2. Убедитесь, что админка доступна для обоих сайтов, данные бэкапа восстановлены.
3. Удалите временные файлы (`restore.php`, архивы, `bitrix/backup/sites/*` при необходимости).
4. Сделайте snapshot VM после успешного восстановления.

## 10. Версионирование кода (опционально)
1. Рабочий корень: `/home/bitrix/ext_www`.
2. Инициализация Git и `.gitignore`:
   ```bash
   cd /home/bitrix/ext_www
   git init
   cat > .gitignore <<'EOF'
   */bitrix/cache/
   */bitrix/managed_cache/
   */bitrix/stack_cache/
   */bitrix/html_pages/
   */upload/
   */bitrix/backup/
   EOF
   git add innov.local s3 .gitignore
   git commit -m "feat: restore innov.local and s3"
   ```
3. Привяжите удалённый репозиторий и выполните `git push`.

Теперь основной сайт (`innov.local`) обслуживается на порту 80, дополнительный (`s3.local`) — на 8080; оба используют общее ядро через симлинки и полностью восстановлены из бэкапа.
