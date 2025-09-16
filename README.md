# Документы и ссылки

- ТЗ: [docs/README.md](docs/README.md) — краткое техническое задание.
- План‑график: [docs/plan-grafik.md](docs/plan-grafik.md) — даты сдачи фаз.
- Архитектура: [docs/architecture.md](docs/architecture.md) — модель данных, воронки, роботы/триггеры, UX, этапы.
- Gitflow: [docs/gitflow.md](docs/gitflow.md) — ветвление, PR‑правила, Conventional Commits, релизы/хотфиксы.
- Удалённая разработка: [docs/remote-dev-workflow.md](docs/remote-dev-workflow.md) — форки, PR, CI/CD, чек‑листы и ритуалы.
- Тест восстановления среды: [docs/system-restore-test-plan.md](docs/system-restore-test-plan.md) — план и критерии RTO/паритета для завершения шага 6.
- Подробный пошаговый цикл задачи — от выбора до Done — см. в [task-flow-guide.md](docs/task-flow-guide.md).

# Быстрый старт из 6 шагов

## Шаг 1. Настраиваем рабочее место: VS Code + базовые инструменты

### Что получится в итоге
- У тебя установлен VS Code с нужными плагинами.
- Код будет одинаково форматироваться у всех (меньше “мусора” в PR).
- VS Code готов подключаться к Bitrix на ВМ через Remote-SSH.
- Git и GitHub готовы к работе (клонировать репо, делать PR).

### 1) Ставим базовые программы

#### 1.1 VS Code
Зачем: это наш главный редактор — кодим, отлаживаем, работаем с Git, задачами и пр.

Установи VS Code (Windows/macOS/Linux). После установки просто запусти его.

#### 1.2 Git
Зачем: без Git не получится клонировать репозиторий, коммитить и отправлять PR.

Установи Git.

Открой терминал и настрой “кто ты”:

```bash
git config --global user.name "Ваше Имя"
git config --global user.email "you@example.com"
```

(Windows) Настрой перевод концов строк, чтобы не было “грязных” дифов:

```bash
git config --global core.autocrlf true
```

#### 1.2.1 Клонируем предоставленный репозиторий GitHub
Поскольку репозиторий уже предоставлен, сразу забери его локально (подставь реальный `<owner>/<repo>`):

HTTPS (проще начать):

```bash
git clone https://github.com/<owner>/<repo>.git
cd <repo>
```

SSH (после настройки ключа в шаге 4):

```bash
git clone git@github.com:<owner>/<repo>.git
cd <repo>
```

#### 1.3 Node.js LTS
Зачем: линтеры и форматтеры для JS/CSS (ESLint, Prettier, Stylelint) запускаются через Node.

Установи Node.js LTS (ставится вместе с npm — менеджером пакетов).

Почему не ставим локальный PHP? Он нам не нужен: PHP и Bitrix будут крутиться внутри ВМ. На твоём компьютере нужны только утилиты для фронта/форматирования и сам редактор.

### 2) Ставим расширения VS Code
Открой VS Code → Extensions (иконка кубика) → поставь плагины:

- Remote – SSH
  - Зачем: будешь открывать код на ВМ так, как будто он локально.
  - (Позже подключимся к ВМ и откроем `/home/bitrix/www/local` прямо из VS Code.)
- PHP Debug
  - Зачем: чтобы ловить брейкпоинты через Xdebug (нужен будет, когда на ВМ включим Xdebug).
- PHP Intelephense (бесплатная версия)
  - Зачем: подсветка, автодополнение и “умные” подсказки по PHP-коду.
- Prettier – Code formatter
  - Зачем: единый формат кода (пробелы, кавычки, запятые). Форматирует JS/TS/JSON/Markdown/CSS и многое другое.
- ESLint
  - Зачем: подсказывает ошибки/рискованные места в JavaScript/TypeScript.
- Stylelint
  - Зачем: проверяет CSS/SCSS (чтобы стили были единообразны и без опечаток).
- EditorConfig for VS Code
  - Зачем: файл `.editorconfig` задаёт базовые правила форматирования для всех редакторов в команде (отступы, переносы строк и пр.).
- GitHub Pull Requests and Issues (по желанию, но удобно)
  - Зачем: работать с PR/Issues GitHub прямо из VS Code.

### 3) Быстрые общие настройки VS Code
Открой Settings (шестерёнка → “Settings”) и включи:
- Format On Save (чтобы файлы авто-форматировались при сохранении).
- Назначь Prettier форматтером по умолчанию.

Или вставь в `settings.json` (Команда “Preferences: Open Settings (JSON)”):

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "files.eol": "\n",
  "editor.tabSize": 2,
  "editor.detectIndentation": false
}
```

Пояснение:
- `formatOnSave` — чтобы каждый раз не нажимать “Format Document”.
- `defaultFormatter` — говорим VS Code: “по умолчанию форматируй Prettier’ом”.
- `files.eol: "\n"` — единый конец строки (Linux-стиль), чтобы не было “мусора” в диффах.
- `tabSize: 2` — удобен для фронтовых файлов. Для PHP сделаем отдельное правило через `.editorconfig`.

### 4) Настраиваем GitHub доступ (любой из вариантов)

- Вариант A — HTTPS (просто и быстро)
  - Когда будешь делать `git clone`, VS Code/терминал попросит логин/токен GitHub.
  - Создай Personal Access Token (classic) в GitHub → используй его вместо пароля при пуше.
  - Плюс: легко начать. Минус: иногда снова логиниться.

- Вариант B — SSH-ключ (чуть сложнее, но удобно)
  - Сгенерируй ключ:

```bash
ssh-keygen -t ed25519 -C "you@example.com"
```

  - Жми Enter везде, ключи появятся в `~/.ssh/`.
  - Возьми содержимое `~/.ssh/id_ed25519.pub` и добавь в GitHub → Settings → SSH keys.
  - Плюс: больше не вводишь пароль/токен. Минус: 2–3 минуты на настройку.

### 5) Проверяем файлы правил в репозитории (или добавляем, если отсутствуют)
В предоставленном репозитории обычно уже есть конфиги форматирования. Проверь наличие файлов ниже; если чего-то не хватает — добавь, чтобы избежать “грязных” PR.

#### 5.1 `.editorconfig` (в корне репозитория)
```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.php]
indent_style = space
indent_size = 4

[*.{js,ts,jsx,tsx,json,css,scss,md,yml,yaml}]
indent_style = space
indent_size = 2
```

Зачем: единые отступы — PHP = 4 пробела, фронт-файлы = 2 пробела, перевод строки LF.

#### 5.2 `.prettierrc.json`
```json
{
  "printWidth": 100,
  "singleQuote": true,
  "trailingComma": "es5",
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

Зачем: Prettier будет одинаково ставить кавычки, запятые и переносы.

Примечание: для PHP код форматирует не Prettier, а твой редактор и дисциплина (4 пробела укажет `.editorconfig`). Позже подключим PHP-инструменты (php-cs-fixer/статанализ) в CI.

### 6) Проверяем, что всё работает
Открой проект в VS Code.

Создай любой файл `test.js`, напиши что-то “криво”:

```js
const x=[1,2,3]
console.log(x)
```

Нажми Save — Prettier автоматически красиво отформатирует:

```js
const x = [1, 2, 3];
console.log(x);
```

Создай `test.php` и проверь, что отступ — 4 пробела (EditorConfig это обеспечит).

Если форматирование не срабатывает: нажми правой кнопкой по файлу → Format Document → выбери Prettier.

### 7) (По желанию) Быстрый старт с GitHub Issues прямо в VS Code
- Нажми F1 → “GitHub: Sign in”.
- Открой вкладку GitHub в VS Code, увидишь Issues/PR.
- Удобно брать задачу и сразу создавать ветку: “Checkout issue”.

### Короткая памятка “зачем всё это”
- VS Code — твоя среда: редактирование, git, расширения, отладка.
- Git — история изменений, ветки, PR.
- Node.js — чтобы запускать линтеры/форматтеры (ESLint/Prettier/Stylelint).
- Remote-SSH — редактируем файлы на ВМ как локальные (жизненно важно для Bitrix).
- PHP Debug — сможем ставить брейки в PHP (когда подключим Xdebug на ВМ).
- Prettier/EditorConfig/ESLint/Stylelint — “чистые” дифы и единый стиль кода у всей команды.

Примечание: для приватных репозиториев в организациях нужны права Owner/Админ организации.

## Шаг 2 из 7. Поднимаем Bitrix во виртуальной машине (VMware) и готовим доступ

### Цель шага
У тебя к концу будет рабочая ВМ с Bitrix, к которой можно зайти по SSH и открыть сайт в браузере по доменному имени (например, `innov.local`). Всё делаем максимально просто и безопасно.

### Что ставим и зачем
- VMware Workstation / Player / Fusion — гипервизор. В нём будет жить сервер Bitrix.
- BitrixVM (готовый образ) — упрощает установку nginx+PHP+MySQL и сам Bitrix; в нём есть меню `/root/menu.sh` для управления.
- SSH доступ — чтобы дальше подключаться из VS Code (удалённая разработка).
- Локальное доменное имя + запись в hosts — чтобы сайт открывался по красивому URL.

### 0) План по ресурсам ВМ (чтобы не тормозило)
- CPU: 4 vCPU (минимум 2, но лучше 4)
- RAM: 8 ГБ (минимум 4 ГБ; с 8 ГБ комфортно)
- Диск: 60–100 ГБ (динамический)
- Сеть: Bridged (чтобы ВМ получила свой IP в твоей сети; NAT тоже можно, но Bridged проще для ping/SSH)

Почему так: Bitrix — это PHP+MySQL+поиск/кеш. Чем больше памяти, тем меньше «свапа» и лагов. Bridged даёт простой прямой доступ по IP.

### 1) Создаём ВМ в VMware
- Сначала скачай готовую виртуальную машину с сайта 1С-Битрикс: [https://www.1c-bitrix.ru/download/vmbitrix.php#tab-section-1](https://www.1c-bitrix.ru/download/vmbitrix.php#tab-section-1). Выбирай вариант **VMBitrix на базе Alma Linux 9** — сейчас это самый стабильный образ.
- Запусти VMware → Create a New Virtual Machine.
- Укажи образ BitrixVM (или ISO), тип ОС — Linux (обычно CentOS/Alma/Rocky подходит).
- Выбери ресурсы из плана выше (vCPU, RAM, диск).
- В настройках сети выбери Bridged.
- Создай ВМ и запусти.

Простой смысл: ты запускаешь «мини‑сервер» у себя на компе.

### 2) Первая загрузка и вход в меню BitrixVM
- После загрузки войди под root (пароль задаётся при установке образа/на первой загрузке).
- Открой меню администрирования:

```
/root/menu.sh
```

Это главный «пульт управления» BitrixVM: создание пула, сайта, баз данных и т.д.

Меню экономит время: не нужно вручную конфигурировать nginx/MySQL — всё делает мастер.

### 3) Сеть внутри ВМ
- В меню BitrixVM проверь сети:
  - Получение IP — обычно по DHCP (это нормально). Узнай выданный IP командой:

```
ip a
```

- (Опционально) Если хочешь статический IP, в меню есть пункт настройки сети; можно задать IP из своей подсети.
- Проверь пинг из твоего ПК:

```
ping <IP_адрес_ВМ>
```

Если пинг идёт — сеть готова. Зачем: без сети ты не подключишься по SSH и не откроешь сайт в браузере.

### 4) Создаём «пул» и сайт в меню BitrixVM
- В `/root/menu.sh`:
  - Создать пул (обычно Single, если одна ВМ).
  - Создать сайт/хост. Тебя попросят указать домен, например: `innov.local`.
- Мастер развернёт nginx+PHP+MySQL и подготовит веб‑корень (обычно `/home/bitrix/www`).
- Запомни/запиши данные MySQL (хост/логин/база) — пригодятся для импортов дампов.

Идея: «пул» — это как набор сервисов (nginx, php‑fpm, mysql). «Сайт» — конкретный хостнейм (домен), который указывает на папку с кодом.

### 5) Прописываем домен на своём компьютере (hosts)
Чтобы браузер знал, куда идти по `innov.local`:
- Windows: `C:\Windows\System32\drivers\etc\hosts`
- macOS/Linux: `/etc/hosts`

Добавь строку (IP возьми у ВМ):

```
<IP_адрес_ВМ>    innov.local
```

Проверь:

```
ping innov.local
```

Должен пинговаться IP ВМ. Это «локальная DNS‑запись»: ты говоришь своему ПК, что домен `innov.local` живёт на IP ВМ.

### 6) Проверяем запуск PHP на ВМ
Зайди в ВМ:

```
ssh root@<IP_адрес_ВМ>
```

(Пароль root; позже добавим ключи.) Создай тестовый файл:

```
echo "<?php phpinfo();" > /home/bitrix/www/info.php
```

Открой в браузере: `http://innov.local/info.php`

Если видишь страницу phpinfo() — nginx+PHP работают. Это как «лампочка проверка»: убедиться, что веб‑сервер и PHP ожили.

### 7) Включаем SSH‑доступ (для дальнейшей работы из VS Code)
На ВМ:
- Убедись, что SSH‑демон работает:

```
systemctl status sshd
```

- Если не активен — включи:

```
systemctl enable --now sshd
```

 - Создай пользователя для разработки (чтобы не сидеть под root):

```
adduser dev
passwd dev
usermod -aG wheel dev   # дать права sudo
```

 > Если Bitrix-утилиты продолжат ругаться на нового пользователя даже после выдачи прав, можно использовать предустановленного пользователя `bitrix`. Он уже входит в нужные группы и работает «из коробки». Главное — либо подключаться по SSH ключом/паролем от `bitrix`, либо оставить пользователя `dev`, но выполнять административные команды через `sudo -u bitrix ...`.

- (Рекомендуется) Настрой вход по ключу:
  - На своём ПК сгенерируй ключ:

```
ssh-keygen -t ed25519 -C "you@example.com"
```

  - Скопируй публичный ключ на ВМ:

```
ssh-copy-id dev@<IP_адрес_ВМ>
```

  - Теперь входи так:

```
ssh dev@<IP_адрес_ВМ>
```

Почему отдельный пользователь: безопаснее и удобнее. Ключ — чтобы не вводить пароль каждый раз и укрепить безопасность.

### 8) Подготовим проектную папку и права
Код Bitrix лежит тут: `/home/bitrix/www`

Наш проект (первая фаза) — это содержимое папки `/home/bitrix/www/local`.

 Сделай выбранного пользователя владельцем `local`, чтобы править файлы без root:

```
sudo chown -R dev:dev /home/bitrix/www/local   # если используешь bitrix, подставь bitrix:bitrix
```

Зачем: чтобы ты мог спокойно редактировать файлы, коммитить, не ломая права системы.

### 9) Проверка доступа по домену и базовая настройка PHP
- Открой `http://innov.local/` — должен грузиться корень сайта (если Bitrix ещё не развёрнут — будет заглушка/дирлистинг; это нормально).
- Убедись, что часовой пояс верный (позже поправим в php.ini/на уровне системы, если нужно).
- Удостоверься, что firewall не блокирует 80/443/22 порты (обычно BitrixVM уже всё открыл).

Важно: в этом шаге мы не устанавливаем Xdebug — это будет в шаге 3 вместе с подключением VS Code по Remote‑SSH.

### 10) Снимем снапшот ВМ (чтобы было куда откатиться)
- В VMware: Take Snapshot (назови, например, `clean-VM-after-setup`). Если что-то пойдёт не так позже — вернёшься в эту точку за минуту.

Это как «сохранение в игре» — экономит часы нервов.

### Короткая памятка «что мы только что сделали»
- Развернули ВМ (мини‑сервер) с готовой средой Bitrix.
- Настроили сеть и домен `innov.local`, чтобы сайт открывался по имени.
- Проверили PHP через `info.php` — веб жив.
- Включили SSH и настроили пользователя для разработки (`dev`, либо стандартного `bitrix`, если он работает стабильнее).
- Подготовили папку `/home/bitrix/www/local` — сюда попадёт код из твоего GitHub‑репозитория.
- Сняли снапшот — безопасная точка отката.

Готово ✅
Следующим шагом (Шаг 3) подключим VS Code по Remote‑SSH к этой ВМ, настроим Xdebug и pathMappings, чтобы ставить брейки и отлаживать PHP‑код прямо из редактора.

## Шаг 3 из 7. Подключаемся к ВМ из VS Code (Remote-SSH) и настраиваем отладку PHP через Xdebug

### Цель шага
Открывать файлы Bitrix на ВМ прямо в VS Code, ставить брейкпоинты и видеть переменные/стек при выполнении PHP-кода.

### Что делаем по итогу
- VS Code подключается к ВМ по Remote-SSH под пользователем `dev` (или `bitrix`, если выбрали его).
- Включён Xdebug v3 в PHP на ВМ, настроен на связь с твоим ПК.
- В проекте есть `.vscode/launch.json` с конфигом PHP Debug и `pathMappings`.
- Простой сценарий: ставим breakpoint → открываем страницу → VS Code останавливается.

### 0) Предпосылки (быстрая проверка)
- ВМ работает, есть её IP (из шага 2).
- Пользователь для SSH (`dev` или `bitrix`) создан/настроен, доступ есть:

```
ssh dev@<IP_ВМ>    # или ssh bitrix@<IP_ВМ>
```

- Код лежит в `/home/bitrix/www`, наша рабочая папка — `/home/bitrix/www/local`.
- Если что-то из этого не готово — вернись к шагу 2.

### 1) Подключаемся из VS Code к ВМ (Remote-SSH)
Зачем: редактируем файлы на ВМ «как локальные» и сразу запускаем отладку.

- Открой VS Code → Command Palette (Ctrl+Shift+P / Cmd+Shift+P) → Remote-SSH: Add New SSH Host….
- Введи строку вида:

```
ssh dev@<IP_ВМ>
```

- Выбери файл конфигурации (обычно `~/.ssh/config`). VS Code добавит хост.
- Снова Command Palette → Remote-SSH: Connect to Host… → выбери этот хост.
- После подключения VS Code спросит платформу удалённой ОС — выбери Linux.
- Внизу слева появится зелёная плашка “SSH: <IP_ВМ>” — значит, ты внутри ВМ.

Открываем папку проекта на ВМ: VS Code (уже в SSH-сессии) → File → Open Folder… → `/home/bitrix/www`.

Проверь, что у тебя есть права на `/home/bitrix/www/local`. Если нет, на ВМ:

```
sudo chown -R dev:dev /home/bitrix/www/local
```

Если «Connection refused»: проверь, что на ВМ запущен `sshd` и не блокируется фаерволом; IP верный; порт по умолчанию 22.

### 2) Устанавливаем Xdebug v3 на ВМ и включаем отладку
Зачем: Xdebug — расширение PHP, которое умеет «останавливать» код и слать отладочную информацию в VS Code.

#### 2.1 Установка Xdebug (на ВМ)
Команды зависят от дистрибутива. Общий принцип:

Посмотреть версию PHP и модули:

```
php -v
php -m | grep -i xdebug
```

Установить (пример через pecl):

```
sudo pecl install xdebug
```

или через пакет менеджера (если есть пакет `php-xdebug`).

#### 2.2 Включаем Xdebug в php.ini
Найдём файл конфигурации (часто `/etc/php.ini` + файлы в `/etc/php.d/*.ini` или `/etc/php/<ver>/mods-available`).

Подключаем расширение (например, в `/etc/php.d/20-xdebug.ini`):

```
zend_extension=xdebug
```

Добавь параметры Xdebug v3 (важно — v3, у него другие имена опций):

```
; включаем режим отладки
xdebug.mode=debug
; начинать отладку по запросу (cookie/GET-параметр)
xdebug.start_with_request=trigger
; попытка авто-определить IP клиента по заголовку
xdebug.client_discover_header=1
; порт VS Code
xdebug.client_port=9003
; уровень логов (0 — выкл.)
xdebug.log_level=0
```

Альтернатива: явно указать IP твоего ПК: `xdebug.client_host=<твой_IP_ПК>`. Но `client_discover_header=1` часто достаточно.

Перезапусти PHP-FPM и nginx:

```
sudo systemctl restart php-fpm
sudo systemctl restart nginx
```

Проверь, что Xdebug подхватился:

```
php -m | grep -i xdebug
```

или открой `http://innov.local/info.php` — на странице phpinfo будет секция Xdebug.

Если Xdebug не виден — проверь путь `zend_extension`, версию PHP, расположение `.ini`, перезапуск служб.

### 3) Ставим расширение PHP Debug (на твоём ПК)
Если не поставил в шаге 1 — установи “PHP Debug” в VS Code. Оно слушает порт 9003 и принимает входящие подключения Xdebug.

### 4) Добавляем конфиг отладчика в проект (`.vscode/launch.json`)
В VS Code открой папку `/home/bitrix/www` → Command Palette → Debug: Open launch.json → выбери PHP. Замени/добавь конфигурацию:

```
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Listen for Xdebug (Remote VM)",
      "type": "php",
      "request": "launch",
      "port": 9003,
      "hostname": "0.0.0.0",
      "pathMappings": {
        "/home/bitrix/www": "${workspaceFolder}"
      },
      "log": false
    }
  ]
}
```

Пояснения:
- `port 9003` — стандарт для Xdebug v3.
- `pathMappings` — сопоставляет путь на ВМ `/home/bitrix/www` с открытой папкой проекта в VS Code. Без этого брейки не попадут.

Если код лежит иначе — поправь левую часть на реальный путь.

### 5) Проверяем «паузы» на брейкпоинтах
- В файле PHP (например, `/home/bitrix/www/bitrix/php_interface/init.php` или свой компонент в `/local/components/...`) поставь breakpoint.
- В VS Code: Run and Debug → “Listen for Xdebug (Remote VM)” → Start.
- Открой страницу, которая выполняет этот код.
- Если `xdebug.start_with_request=trigger`, добавь к URL `XDEBUG_SESSION=1`, например: `http://innov.local/?XDEBUG_SESSION=1`, или поставь cookie.

Если всё ок — VS Code «подсветится», выполнение остановится на брейкпоинте: увидишь Variables, Watch, Call Stack.

Если не ловит:
- Убедись, что слушатель запущен и порт 9003 свободен.
- Проверь, что этот файл реально исполняется.
- Сверь `pathMappings` и реальные пути на ВМ.
- На ВМ в phpinfo() проверь секцию Xdebug.
- Временно поставь `xdebug.start_with_request=yes`, чтобы исключить ошибку с триггером.

### 6) Убираем «лишние тормоза» (после успеха)
- Верни `xdebug.start_with_request=trigger`, чтобы отладка включалась только по запросу.
- Убедись, что `xdebug.log_level=0` (логи отключены).
- Не держи лишние breakpoints — отладка медленнее обычного выполнения.

### 7) Мини-чеклист готовности шага
- VS Code подключается к ВМ по Remote-SSH, папка `/home/bitrix/www` открывается.
- Xdebug v3 установлен и виден в phpinfo().
- В проекте есть `.vscode/launch.json` с портом 9003 и верными `pathMappings`.
- По `?XDEBUG_SESSION=1` VS Code останавливается на брейкпоинте и показывает стек/переменные.

### Простыми словами — что мы сделали и зачем
- Remote-SSH — не копируем файлы туда-сюда: редактируем «на сервере», как локально.
- Xdebug — «пульт паузы»: можно остановить PHP на любой строке и посмотреть переменные.
- `launch.json` + `pathMappings` — согласовали «какой файл где лежит», чтобы брейки попадали точно.
- Триггер отладки — чтобы не тормозить весь сайт, Xdebug включается только по запросу.

## Шаг 4 из 7. Линтеры, форматтеры и CI-проверки (чтобы код всегда был «чистым»)

### Цель шага
Настроить одинаковое форматирование и базовые проверки качества кода автоматически — локально и на каждом Pull Request в GitHub. Это уменьшит “мусор” в диффах и поймает типовые ошибки ещё до ревью.

### Что получим в конце шага
- В репозитории лежат конфиги линтеров/форматтеров.
- Локально можно одной командой проверить/отформатировать проект.
- На GitHub каждый PR автоматически прогоняет проверки (CI).

Самый доступный стек:
- PHP: php-cs-fixer (форматирование), phpstan (статический анализ).
- JS/CSS/MD/JSON: Prettier (форматирование), ESLint (JS/TS), Stylelint (CSS/SCSS).
- EditorConfig (мы уже добавили на шаге 1) — базовые правила отступов и переводов строк.
- GitHub Actions — CI workflow.

### 0) Где ставим инструменты
- Node-инструменты (prettier, eslint, stylelint) — ставим в корне репозитория (там же будет `package.json`). Работают на твоём ПК и в GitHub Actions.
- PHP-инструменты (php-cs-fixer, phpstan) — ставим через Composer:
  - локально (если удобно),
  - и/или на ВМ (чтобы запускать ровно на том же PHP, где крутится проект),
  - в CI проверка будет идти в GitHub Actions (он поднимет нужную версию PHP сам).

Проектный код у нас живёт в `/local`. Линтеры запускаем из корня репозитория, но пути в командах направим на `local/`.

### 1) Добавляем package.json и Node-зависимости
В корне репозитория:

```
npm init -y
npm i -D prettier eslint stylelint @eslint/js eslint-plugin-import eslint-config-prettier stylelint-config-standard stylelint-config-prettier
```

Создай/дополни файлы конфигов (часть мы уже добавляли в шаге 1):

`.prettierrc.json`

```
{
  "printWidth": 100,
  "singleQuote": true,
  "trailingComma": "es5",
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

`eslint.config.js` (современный flat-config)

```
import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    ignores: ["node_modules/**", "vendor/**", "bitrix/**"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
    },
    plugins: {
      import: await import("eslint-plugin-import"),
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "import/order": ["warn", { "newlines-between": "always" }],
    },
  },
  {
    rules: {}, // оставлено для переопределений при необходимости
  },
];
```

`stylelint.config.mjs`

```
export default {
  extends: ["stylelint-config-standard", "stylelint-config-prettier"],
  ignoreFiles: ["**/node_modules/**", "**/vendor/**", "**/bitrix/**"],
  rules: {
    "no-descending-specificity": null
  }
};
```

В `package.json` добавь удобные скрипты:

```
{
  "scripts": {
    "fmt:check": "prettier --check \"**/*.{js,jsx,ts,tsx,css,scss,md,json,yml,yaml}\"",
    "fmt:write": "prettier --write \"**/*.{js,jsx,ts,tsx,css,scss,md,json,yml,yaml}\"",
    "lint:js": "eslint \"local/**/*.{js,jsx,ts,tsx}\"",
    "lint:css": "stylelint \"local/**/*.{css,scss}\"",
    "lint:all": "npm run fmt:check && npm run lint:js && npm run lint:css",
    "fmt:all": "npm run fmt:write"
  }
}
```

Простыми словами: `fmt:write` красиво отформатирует почти всё «фронтовое», `lint:js` и `lint:css` проверят ошибки в JS/CSS. Мы ограничили путь `local/`, чтобы не трогать системные папки Bitrix.

### 2) Ставим PHP-инструменты через Composer
Если Composer ещё не установлен:
- На ВМ (рекомендуется): установи Composer и запусти команды ниже из корня репозитория (или из `/home/bitrix/www` — куда тебе удобнее хранить `composer.json`, главное — коммитить его в Git).
- Либо локально (но следи, чтобы версии PHP совпадали с ВМ/продом).

Установка:

```
composer init --name vendor/innovation-platform --no-interaction
composer require --dev friendsofphp/php-cs-fixer phpstan/phpstan
```

Создай конфиги:

`.php-cs-fixer.php`

```
<?php

$finder = PhpCsFixer\Finder::create()
    ->in([__DIR__ . '/local'])
    ->name('*.php')
    ->ignoreVCS(true)
    ->ignoreDotFiles(true);

return (new PhpCsFixer\Config())
    ->setRiskyAllowed(true)
    ->setRules([
        '@PSR12' => true,
        'array_syntax' => ['syntax' => 'short'],
        'no_unused_imports' => true,
        'single_quote' => true,
        'binary_operator_spaces' => ['default' => 'align_single_space_minimal'],
    ])
    ->setFinder($finder);
```

`phpstan.neon`

```
parameters:
  paths:
    - local
  level: 5
  tmpDir: var/phpstan
  ignoreErrors:
    - '#Call to unknown method C[^:]+::#'  # пример: Bitrix классы без явных сигнатур
```

(Создай папку `var/phpstan`, если понадобится: `mkdir -p var/phpstan`.)

Удобные Composer-скрипты (добавь в `composer.json`):

```
{
  "scripts": {
    "cs:check": "php-cs-fixer fix --dry-run --diff",
    "cs:write": "php-cs-fixer fix",
    "stan": "phpstan analyse"
  }
}
```

Проверки запустить так:

```
composer cs:check
composer stan
```

Автоисправление форматирования:

```
composer cs:write
```

Простой смысл: php-cs-fixer — «красит» PHP-код под один стиль, phpstan — ищет потенциальные ошибки типов/вызовов.

### 3) Добавляем GitHub Actions (CI) — автоматические проверки на PR
Создай файл `.github/workflows/ci.yml`:

```
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  php:
    name: PHP CS Fixer & PHPStan
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: "8.1"
          coverage: none
          tools: composer:v2

      - name: Install PHP deps
        run: composer install --no-interaction --no-progress

      - name: PHP CS Fixer (check)
        run: vendor/bin/php-cs-fixer fix --dry-run --diff

      - name: PHPStan
        run: vendor/bin/phpstan analyse

  node:
    name: Prettier / ESLint / Stylelint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "lts/*"
          cache: "npm"

      - name: Install node deps
        run: npm ci

      - name: Prettier check
        run: npm run fmt:check

      - name: ESLint
        run: npm run lint:js

      - name: Stylelint
        run: npm run lint:css
```

Что делает CI: поднимает PHP и Node в «чистой» среде, ставит зависимости и гоняет проверки. Любая ошибка — PR станет «красным» до исправления.

### 4) Запускаем локально и проверяем CI
Локально:

```
npm run fmt:write    # красиво отформатирует фронтовые файлы
npm run lint:js
npm run lint:css
composer cs:write    # красиво отформатирует PHP
composer stan        # проверит типовые ошибки
```

Залей коммиты в ветку → открой PR → на вкладке Checks увидишь результаты CI. Если всё зелёное — отлично.

### 5) Советы «на каждый день»
Запускай автоформат перед коммитом:

```
npm run fmt:write && composer cs:write
```

Если phpstan ругается на Bitrix-классы без явных сигнатур — не паникуй. Мы уже добавили `ignoreErrors`-шаблон. При необходимости Лид добавит больше исключений или сделает сниппеты-стабсы.

Не трогай системные папки Bitrix — работаем только в `local/`.

Если CI упал — открой лог конкретного шага, он подскажет, где ошибка (обычно это лишняя запятая/пробелы/неиспользуемый импорт и т.п.).

### 6) Результат шага (чек-лист)
- В проекте есть `package.json` и установлены prettier, eslint, stylelint.
- Настроены конфиги: `.prettierrc.json`, `eslint.config.js`, `stylelint.config.mjs`.
- Установлены php-cs-fixer, phpstan, созданы `.php-cs-fixer.php`, `phpstan.neon`, добавлены Composer-скрипты.
- Создан GitHub Actions workflow `.github/workflows/ci.yml`.
- Локальные команды (npm run ..., composer ...) работают, CI на PR — зелёный.

### Простыми словами — зачем это всё
- Форматтеры (Prettier, PHP CS Fixer) убирают споры о “стиле” — код всегда один по виду.
- Линтеры (ESLint, Stylelint) ловят опечатки и опасные места.
- PHPStan заранее сигналит о подозрительных вызовах и несовпадениях типов.
- CI делает те же проверки автоматически в облаке — чтобы в `main` попадал только «чистый» код.

Готово ✅
Дальше (Шаг 5) настроим репозиторий/ветвление, CODEOWNERS и защиту веток, дадим обзор трекинга задач со ссылкой на подробный гайд.

## Шаг 5 из 7. Репозиторий, ветвление, CODEOWNERS и защита веток

### Цель шага
Чтобы понимать, куда пушить, как называть ветки, как описывать задачи/PR, и почему PR иногда «не мержится». Сделаем это на GitHub — просто и прозрачно.

### Что получится в конце
- Оформленный репозиторий (README, структура).
- Единые правила ветвления и коммитов (Conventional Commits).
- Обзор трекинга задач и ссылка на полный цикл: [task-flow-guide.md](docs/task-flow-guide.md).
- CODEOWNERS → автозапрос ревью у нужных людей.
- Branch protection для main → нельзя случайно сломать прод.

### 1) Базовая структура репозитория
Полная структура с описаниями вынесена в отдельный документ: см. «Структура репозитория» в docs/gitflow.md.

Коротко: работа ведётся только в `/local/`; миграции — через `sprint.migration` и `bin/migrate`; CI/CD — в `/.github/workflows/`; вспомогательные скрипты — в `scripts/`.

### 2) Ветвление и Conventional Commits
#### 2.1 Одна защищённая основная ветка
- Главная ветка: `main`
- Все изменения — только через PR из коротких фич-веток.

#### 2.2 Именование веток
Просто и понятно:

```
feat/<кратко-задача>
fix/<кратко-баг>
chore/<сервисная-задача>
docs/<документация>
refactor/<без-изменения-функционала>
```

Примеры:

```
feat/crm-idea-form
fix/webhook-idempotency
docs/readme-quickstart
```

Создать ветку:

```
git checkout -b feat/crm-idea-form
```

#### 2.3 Conventional Commits (коротко)
Сообщения коммитов начинаем с типа:

```
feat: добавлена форма идеи
fix: чинит null при создании таска
docs: дополнил README инструкцией по запуску
refactor: упростил обработчик webhook
chore: обновил конфиги линтеров
```

Это нужно, чтобы история была читаемой; потом удобно собирать релизы.

### 3) Трекинг задач: обзор и ссылка на гайд
Используем стандартные инструменты GitHub для трекинга работы:

- Issues: постановка задач и багов, обсуждения.
- Pull Requests: ревью и слияние изменений; связываем с задачами через `Closes #…`.
- Labels/Milestones/Projects: метки, вехи и (опционально) доска для визуального статуса.
- Подробный пошаговый цикл задачи — от выбора до Done — см. в [task-flow-guide.md](docs/task-flow-guide.md).

### 4) CODEOWNERS (автозапрос ревью)
Создай файл `CODEOWNERS` в корне:

```
# по умолчанию все файлы проверяет Lead
*        @lead-github-login

# php и конфиги — тоже Lead
*.php    @lead-github-login
*.php3   @lead-github-login
*.neon   @lead-github-login

# фронт-часть может ревьюить фронт-лид (если есть)
*.{js,jsx,ts,tsx,css,scss}  @frontend-github-login

# папка local — основной код
/local/  @lead-github-login
```

Теперь, когда откроют PR, GitHub сам запросит ревью от нужных людей.

### 5) Защита ветки main (Branch protection)
Репозиторий → Settings → Branches → Branch protection rules → Add rule:

- Branch name pattern: `main`

Включить:

- ✅ Require a pull request before merging
- ✅ Require approvals (1 approval достаточно; можно 2)
- ✅ Require review from Code Owners
- ✅ Require status checks to pass before merging (выбери CI-проверки из шага 4)
- ✅ Require conversation resolution before merging
- ❌ (по желанию) Restrict who can push to matching branches (обычно включают)
- ✅ Do not allow bypassing the above settings

Результат: в `main` нельзя попасть «мимо PR», без ревью и зелёного CI.

### 6) CONTRIBUTING.md (короткий гайд для всех)
Создай `CONTRIBUTING.md`:

```
# Как мы вносим изменения

## Ветвление
- Основная ветка: `main` (защищена).
- Рабочие ветки: `feat/...`, `fix/...`, `chore/...`, `docs/...`, `refactor/...`.

## Коммиты
- Используем Conventional Commits:
  - feat: новая фича
  - fix: исправление
  - docs:, refactor:, chore:, etc.

## Перед PR
1) Форматирование/линты/стат-анализ:
   ```bash
   npm run fmt:write
   npm run lint:js && npm run lint:css
   composer cs:write
   composer stan
   ```

Обнови README/доки, если менялся флоу.

Приложи скрин/видео (если UI).

## PR
Заполняем шаблон полностью.

Нужен минимум 1 approve (Lead) и зелёный CI.

PR небольшие (до ~300 строк diff).

## После merge
Проверка на staging.

### 7) Мини-ритуалы и «готов к работе»
- Issue → ветка → PR — всегда так. Любая работа начинается с задачи (Issue), под неё создаётся ветка, результат заливается только через Pull Request.
- Маленькие PR — старайся, чтобы изменения были компактными (до ~300 строк diff). Чем меньше PR, тем быстрее ревью и проще найти ошибку.
- Единый стиль кода — перед каждым PR запускай проверки:

```
npm run fmt:write
npm run lint:js && npm run lint:css
composer cs:write
composer stan
```

Это гарантирует, что код «чистый» и одинаковый у всех.

- Релизы — теги версий (`v0.x.y`) создаёт Lead. Это фиксирует стабильные точки в истории проекта.
- PR закрывает Issue — в описании PR указывай `Closes #123`, чтобы GitHub автоматически закрыл задачу после мержа.
- Сразу проверяем staging — после того как PR попал в `main`, смотри, что изменения появились на staging-среде и работают как ожидалось.

### 8) Чек-лист готовности шага
- Есть README.md с инструкцией быстрого старта.
- Есть краткий обзор трекинга задач и ссылка на [task-flow-guide.md](docs/task-flow-guide.md).
- Создан файл CODEOWNERS для автозапроса ревью.
- Включена защита ветки `main` с обязательным ревью и зелёным CI.
- Приняты правила ветвления и Conventional Commits.
- Прохождение подробного пошагового цикла задачи — от выбора до Done — см. в [task-flow-guide.md](docs/task-flow-guide.md).


### Простыми словами — зачем это всё
- Понятный обзор трекинга задач и единые правила помогают быстро включаться в работу.
- CODEOWNERS гарантирует, что нужные люди увидят PR и проверят его.
- Защита ветки `main` уберегает от случайных ошибок и прямых пушей.
- Единые правила веток и коммитов делают историю проекта читаемой, а релизы — предсказуемыми.

## Шаг 6 из 7. CD (staging → prod) c модулем «Миграции для разработчиков» (sprint.migration) + import/export CRM + BP

Цель: код из /local уезжает на сервер, а структурные изменения БД применяются через миграции — одинаково на всех средах.

### 6.1. Подключаем sprint.migration в проект

Установка через composer (чтобы модуль лежал в /local/modules/ и коммитился вместе с кодом):

```json
{
  "extra": {
    "installer-paths": {
      "local/modules/{$name}/": ["type:bitrix-module"]
    }
  },
  "require": {
    "andreyryabin/sprint.migration": "dev-master"
  }
}
```

Это официальный способ положить модуль в local/modules.

Где что лежит по умолчанию

- Модуль: `local/modules/sprint.migration` (или `bitrix/modules/...`)
- Папка миграций: `local/php_interface/migrations`
- Конфиг: `local/php_interface/migrations.cfg.php` (доп. конфиги — `migrations.{NAME}.php`)


Зачем модуль
Все изменения БД живут в файлах миграций и версионируются в git; на серверах мы «накатываем» новые версии одной командой. Можно работать из консоли и из админки.

### 6.2. Готовим консольный алиас bin/migrate

Создай файл `bin/migrate` в корне сайта (исполняемый):

```php
#!/usr/bin/env php
<?php
$_SERVER['DOCUMENT_ROOT'] = dirname(__DIR__);
$path = $_SERVER['DOCUMENT_ROOT'].'/local/modules/sprint.migration/tools/migrate.php';
if (!file_exists($path)) {
    $path = $_SERVER['DOCUMENT_ROOT'].'/bitrix/modules/sprint.migration/tools/migrate.php';
}
require_once $path;
```

Сделай файл исполняемым: `chmod +x bin/migrate`.

Теперь команды: `php bin/migrate add|ls|up|down` … (ниже). Это рекомендованный способ от автора.

Базовые команды:

- `php bin/migrate add` — создать заготовку миграции
- `php bin/migrate ls` — список версий
- `php bin/migrate up [version]` — накатить (все/одну)
- `php bin/migrate down [version]` — откатить (все/одну)

Если используешь альтернативный конфиг: `--config=release001`.

### 6.3. Как мы делаем миграции (процесс для команды)

- Дев пишет код в `/local` и создаёт миграцию (`php bin/migrate add`) для ИБ/HL-блоков/польз. полей/агентов и т.п.
- В `up()` — изменения, в `down()` — аккуратный откат.
- Коммитит код + файл миграции в PR.
- На staging и prod миграции запускаются уже из CD (см. ниже).
- Для «тяжёлых» операций используйте пошаговые миграции с `restart()/restartOnce()` — модуль умеет безопасно «дробить» выполнение на шаги (особенно полезно через админку).

### 6.4. CD: выкладка и накат миграций на staging (авто по merge в main)

Идея пайплайна:

- (Из шага 4) CI зелёный → запускаем job `deploy_staging`.
- Доставляем только разрешённое: `/local/**` (и, если нужно, `bin/migrate`, `migrations.cfg.php`).
- После синка: накатываем миграции командой `php bin/migrate up`.
- (Опционально) чистим/прогреваем кеш.

Пример шагов деплоя (псевдокод GitHub Actions):

```yaml
jobs:
  deploy_staging:
    needs: [php, node]        # ждать проверки из CI
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Rsync /local to staging
        run: rsync -az --delete local/ user@STAGING:/home/bitrix/www/local

      - name: Upload bin/migrate & config
        run: |
          rsync -az bin/migrate user@STAGING:/home/bitrix/www/bin/migrate
          rsync -az local/php_interface/migrations.cfg.php user@STAGING:/home/bitrix/www/local/php_interface/

      - name: Run migrations (up)
        run: ssh user@STAGING "cd /home/bitrix/www && php bin/migrate up --config=release001 || true"

      - name: Cache warmup (optional)
        run: ssh user@STAGING "php -r '/* your warmup */;' || true"
```

Почему так: модуль «знает», какие версии уже применены (таблица `sprint_migration_versions`), и накатывает только новые; сами миграции лежат в `local/php_interface/migrations`.
 
### 6.5. CD: выкладка на prod (ручной запуск по тегу)

- Тегируем релиз `vX.Y.Z` → job `deploy_prod` доступен вручную (manual approval).
- Ступени те же: `rsync /local` → `php bin/migrate up --config=release001`.
- Если что-то пошло не так — roll back:
  - быстрая мера: откат до снапшота ВМ (ты делал на шаге 2),
  - мягкий откат данных: `php bin/migrate down [version]` (только если миграция написана с корректным `down()`).

### 6.6. Политика веток и миграций (что важно зафиксировать)

- Каждая структурная правка БД = отдельная миграция в том же PR, что и код.
- Никогда не правим БД руками на сервере — только миграциями.
- Имя конфига `release001/002` можно использовать как «ветку» миграций под конкретный релиз.

Если проект огромный — разрешены пошаговые миграции (`restart*`) для долгих операций.

### 6.7. Что проверить Lead’у (чек-лист)

- Модуль установлен и лежит в репозитории под `local/modules/sprint.migration`.

- Папка `local/php_interface/migrations` и `migrations.cfg.php` присутствуют.

- Работает `php bin/migrate ls/up/down` на staging через SSH.

- В CD скрипте сначала rsync, потом migrate up.

- На prod — ручное подтверждение релиза; план отката: снапшот ВМ + down.

Коротко: почему именно так

sprint.migration хранит изменения БД в версионируемых файлах и накатывает их скриптом, одинаково на всех средах.

Консольный вход через migrate.php и алиас bin/migrate — официальный путь; базовые команды add/ls/up/down стандартны.

Расклад по папкам/конфигам — как в вики модуля; под релизы можно заводить отдельные конфиги.

### 6.8. Экспорт/импорт настроек CRM (Solution presets)

Что именно переносят пресеты

Администратор может выгрузить/загрузить пресет CRM, в который входят: кастомные поля, стадии и воронки, формы карточек, правила автоматизации/триггеры, БП, CRM-формы и смарт-процессы. Импорт в целевом аккаунте заменяет текущие настройки CRM этими значениями.

Важно: при импорте пресета CRM в целевом аккаунте удаляются лиды/сделки; перед импортом их нужно экспортировать (бэкап). Пресет выгружается/загружается как папка/архив JSON-файлов.

Экспорт пресета CRM (источник)

Зайдите в CRM → ⚙️ Настройки → Solution presets.

Нажмите Export и скачайте архив пресета (JSON-ы). Сохраните копию в артефакты релиза.

Импорт пресета CRM (целевой)

Выполните пре-чек:
– админ-права;
– экспортируйте данные CRM (лиды/сделки/контакты и т. п.) в CSV/Excel;
– оповестите пользователей о «окне» и зафиксируйте текущие настройки.

CRM → ⚙️ Настройки → Solution presets → Import.

Укажите архив пресета и подтвердите замену настроек.

Дождитесь завершения, затем проверьте: воронки/стадии, формы, автоматику/триггеры, БП, поля СП.

### 6.9. Экспорт/импорт шаблонов БП (.bpt)

Что поддержано «из коробки»

БП (workflow templates) экспортируются/импортируются как .bpt:
– экспорт/импорт доступен из дизайнера БП;
– нельзя переносить шаблон между разными типами документов (например, из CRM в Списки);
– при импорте подтягиваются поля сущности, задействованные в процессе.

Экспорт .bpt

Откройте конструктор: CRM → Настройки → Автоматизация → Бизнес-процессы (или нужный модуль/сущность).

Выберите шаблон → Export → скачайте .bpt.
Импорт .bpt

На целевом портале откройте тот же раздел/тип документа.

Import → укажите .bpt. Убедитесь, что тип документа совпадает.

Автоматизация через API: шаблон можно загрузить программно методом bizproc.workflow.template.add, а обновлять — ...template.update (для шаблонов, созданных вашим приложением). Удобно для CD.

### 6.10. Как совместить с sprint.migration в CD

Идея: разделить «одноразовую инициализацию» среды (bootstrap) и инкрементальные изменения.

A) Bootstrap новой среды (staging/prod впервые)

Порядок шагов в релизном чек-листе:

- Деплой кода (`/local`) → быстрая smoke‑проверка.
- Импорт пресета CRM (ручной шаг админа; окно «тишины»; есть бэкап данных). Это быстро поднимает: СП, воронки/стадии, формы, роботов, БП и т. д.
- Импорт/загрузка БП (если храните отдельно):
  - через UI `.bpt`,
  - либо скриптом в CD: `bizproc.workflow.template.add/update`.
- `sprint.migration up` — накат изменений БД/структуры коробки (ИБ/HL‑блоки, UF и т. п.).
- Проверки прав/форм/стадий и smoke‑сценариев.

B) Инкрементальные изменения (каждый релиз)

- Код и структура БД — через `sprint.migration up` (см. 6.4/6.5).
- Настройки CRM — по возможности точечно через UI/скрипты; полную пере‑загрузку пресета на prod не применять без веской причины.
- Шаблоны БП — версионировать и обновлять по мере изменения (через UI или API в CD).

### 6.11. Пост‑деплой чек‑лист (staging/prod)

- Миграции: `php bin/migrate ls` — нет висящих версий; таблица `sprint_migration_versions` обновлена.
- CRM: воронки/стадии соответствуют ожиданиям; формы карточек открываются; права и видимость корректны.
- БП: нужные шаблоны присутствуют и активны; пробный запуск на тестовой сущности проходит без ошибок.
- Кеш: выполнена очистка/прогрев (если используется).
- Мониторинг: ошибки в логах веб‑сервера/PHP отсутствуют; ключевые smoke‑сценарии работают.


### 6.12. Завершение шага

- Пройдите «План теста на воссоздание состояния системы»: [docs/system-restore-test-plan.md](docs/system-restore-test-plan.md).
- Зафиксируйте фактический RTO и протокол (паритет CRM/СП/стадий = 100%, миграции применены, сквозные сценарии проходят, критических ошибок нет).
- Шаг 6 считается завершённым при выполнении всех критериев успешности теста.


