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
1. Получите параметры от DHCP (по умолчанию VM стартует в auto-режиме):
   ```bash
   nmcli device show eth0 | grep -E 'IP4.ADDRESS|IP4.GATEWAY|IP4.DNS'
   ```
   Запишите выданные значения, например:
   - адрес: `172.19.108.208/20`;
   - шлюз: `172.19.96.1`;
   - DNS: `172.19.96.1`, `8.8.8.8`.
2. Зафиксируйте эти параметры как статические:
   ```bash
   nmcli connection modify "Wired connection 1" \
     ipv4.method manual \
     ipv4.addresses "172.19.108.208/20" \
     ipv4.gateway 172.19.96.1 \
     ipv4.dns "172.19.96.1 8.8.8.8" \
     connection.autoconnect yes
   nmcli connection down "Wired connection 1"
   nmcli connection up "Wired connection 1"
   ```
   Проверьте `ip addr show eth0` и `ip route` — должен быть только статический адрес и маршрут по умолчанию.
3. На локальной машине добавьте запись в `hosts` (подставьте свой IP):
   ```
   172.19.108.208 innov.local
   ```
3. Сгенерируйте SSH-ключ на Windows:
   ```powershell
   ssh-keygen -t ed25519
   ```
4. Скопируйте ключ пользователю `bitrix` и `root`:
   ```powershell
   type $env:USERPROFILE\.ssh\id_ed25519.pub |
     ssh bitrix@172.19.108.208 "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"

   type $env:USERPROFILE\.ssh\id_ed25519.pub |
     ssh root@172.19.108.208 "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"
   ```
5. В `~/.ssh/config` добавьте:
   ```
   Host bitrix-vm
       HostName 172.19.108.208
       User bitrix
       IdentityFile ~/.ssh/id_ed25519

   Host bitrix-vm-root
       HostName 172.19.108.208
       User root
       IdentityFile ~/.ssh/id_ed25519
   ```
6. Подключитесь по SSH и через VS Code (Remote SSH) к `/home/bitrix`.

## 3. Создание пула и основного сайта
1. `/root/menu.sh` → «Управление пулом» → «Создать пул» → режим *Single* (оставьте nginx/php/mysqld включёнными).
2. `/root/menu.sh` → «Управление веб-сайтами» → «Создать сайт» (первый, базовый).
   - Тип: `kernel`.
   - Домен: основной (`innov.local` в примере).
   - DocumentRoot: `/home/bitrix/www`.
   - SITE_ID: `s1`.
   - Cron: `y`.
3. Для второго сайта (дополнительного) снова «Создать сайт»:
   - Тип: `kernel`.
   - Домен: `innovations.local`.
   - DocumentRoot: `/home/bitrix/ext_www/innovations`.
   - SITE_ID: `s3`.
   - Cron при необходимости.
4. Убедитесь, что первый сайт установлен в `/home/bitrix/www`, второй — в `/home/bitrix/ext_www/innovations`. Пропишите оба домена в `hosts` и завершите мастера установки для каждого.

## 4. Загрузка бэкапа
1. Переместите файлы в корень сайта (рядом с `restore.php`):
   ```powershell
   scp backup-01.tar.gz root@172.19.108.208:/home/bitrix/ext_www/innov.local/
   scp restore.php root@172.19.108.208:/home/bitrix/ext_www/innov.local/
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
   mkdir -p /home/bitrix/www/bitrix/{cache,managed_cache,stack_cache,html_pages}
   chown -R bitrix:bitrix /home/bitrix/www/bitrix
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
   rm -rf /home/bitrix/www/bitrix/cache/*
   rm -rf /home/bitrix/www/bitrix/managed_cache/*
   rm -rf /home/bitrix/www/bitrix/stack_cache/*
   rm -rf /home/bitrix/www/bitrix/html_pages/*
   ```

## 6. Перенос файлов второго сайта (s3) и общий код
1. После восстановления архива проверьте каталог `/home/bitrix/www/bitrix/backup/sites/s3` — в нём лежит снимок второго сайта (SITE_ID `s3`).
2. Скопируйте содержимое в DocumentRoot второго сайта:
   ```bash
   sudo -u bitrix cp -a /home/bitrix/www/bitrix/backup/sites/s3/. /home/bitrix/ext_www/innovations/
   chown -R bitrix:bitrix /home/bitrix/ext_www/innovations
   ```
3. Чтобы оба сайта использовали общий код ядра и каталоги `local`/`upload`, замените их на симлинки:
   ```bash
   cd /home/bitrix/ext_www/innovations
   rm -rf bitrix local upload
   ln -s /home/bitrix/www/bitrix bitrix
   ln -s /home/bitrix/www/local local
   ln -s /home/bitrix/www/upload upload
   ```
   (Если требуется полностью изолированный сайт, этот шаг пропустите и используйте собственные каталоги.)

## 7. Настройка nginx и портов
1. Откройте конфигурацию первого сайта (обычно `/etc/nginx/bx/site_enabled/bx_site_innov.local.conf`) и убедитесь, что он слушает порт 80 и домен `innov.local`.
2. Откройте конфигурацию второго сайта (`/etc/nginx/bx/site_enabled/bx_ext_innovations.local.conf`):
   ```nginx
   listen 8080;
   server_name innovations.local;
   server_name_in_redirect off;
   ```
3. Проверьте и перезагрузите nginx:
   ```bash
   nginx -t
   systemctl reload nginx
   ```
4. На локальном ПК добавьте домены в `hosts`:
   ```
   172.19.108.208 innov.local
   172.19.108.208 innovations.local
   ```
   Второй сайт будет доступен по `http://innovations.local:8080/`.

## 8. Привязка сайтов в Bitrix
1. Перейдите в `/bitrix/admin/site_admin.php`.
   - `s1`: домен `innov.local`, каталог `/`, DocumentRoot `/home/bitrix/www`.
   - `s3`: домен `innovations.local:8080`, каталог `/`, DocumentRoot `/home/bitrix/ext_www/innovations`.
2. В `/home/bitrix/www/bitrix/php_interface/dbconn.php` добавьте выбор SITE_ID:
   ```php
   if ($_SERVER['HTTP_HOST'] === 'innovations.local:8080') {
       define('SITE_ID', 's3');
   } else {
       define('SITE_ID', 's1');
   }
   ```
3. Очистите кэши:
   ```bash
   rm -rf /home/bitrix/www/bitrix/cache/*
   rm -rf /home/bitrix/www/bitrix/managed_cache/*
   ```

## 9. Проверка и финализация
1. Проверьте доступность обоих сайтов:
   - `http://innov.local/`
   - `http://innovations.local:8080/`
2. Убедитесь, что админка открывается по обоим доменам и данные бэкапа восстановлены.
3. Удалите временные файлы (`restore.php`, архивы, `bitrix/backup/sites/*` при необходимости).
4. Сделайте snapshot VM после успешного восстановления.

## 10. Версионирование кода (опционально)
1. Рабочий корень: `/home/bitrix`.
2. Инициализация Git и `.gitignore`:
   ```bash
   cd /home/bitrix
   git init
   cat > .gitignore <<'EOF'
   */bitrix/cache/
   */bitrix/managed_cache/
   */bitrix/stack_cache/
   */bitrix/html_pages/
   */upload/
   */bitrix/backup/
   EOF
   git add www ext_www/innovations .gitignore
   git commit -m "feat: restore www and innovations sites"
   ```
3. Привяжите удалённый репозиторий и выполните `git push`.

Теперь основной сайт (`innov.local`) обслуживается на порту 80, дополнительный (`innovations.local`) — на 8080; оба используют общее ядро через симлинки и полностью восстановлены из бэкапа.
