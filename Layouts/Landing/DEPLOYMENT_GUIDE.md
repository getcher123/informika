# 🚀 Подробное руководство по деплою

Это пошаговое руководство поможет вам развернуть проект на различных платформах.

## 📋 Содержание

1. [Подготовка к деплою](#подготовка-к-деплою)
2. [Деплой на Vercel](#деплой-на-vercel)
3. [Деплой на Netlify](#деплой-на-netlify)
4. [Деплой на GitHub Pages](#деплой-на-github-pages)
5. [Деплой на собственный сервер](#деплой-на-собственный-сервер)
6. [Настройка домена](#настройка-домена)

---

## Подготовка к деплою

### 1. Проверка проекта локально

Перед деплоем убедитесь, что проект работает корректно:

```bash
cd client

# Создайте production сборку
pnpm build

# Проверьте сборку локально
pnpm preview
```

Откройте http://localhost:4173 и проверьте:
- ✅ Все страницы загружаются
- ✅ Изображения отображаются
- ✅ Ссылки работают
- ✅ Нет ошибок в консоли браузера

### 2. Проверка файлов сборки

После `pnpm build` должна появиться папка `client/dist/`:

```
client/dist/
├── assets/
│   ├── index-[hash].js      # Минифицированный JavaScript
│   ├── index-[hash].css     # Минифицированный CSS
│   └── [images]             # Оптимизированные изображения
└── index.html               # Главный HTML файл
```

---

## Деплой на Vercel

**Vercel** - рекомендуемая платформа для React приложений. Бесплатный план включает:
- Автоматический HTTPS
- CDN по всему миру
- Автоматические деплои из Git

### Способ 1: Через Vercel CLI (рекомендуется)

#### Шаг 1: Установка Vercel CLI

```bash
npm install -g vercel
```

#### Шаг 2: Логин в Vercel

```bash
vercel login
```

Следуйте инструкциям для авторизации через браузер.

#### Шаг 3: Деплой проекта

```bash
# Перейдите в корневую директорию проекта
cd accelerator-mosobavuz

# Запустите деплой
vercel
```

При первом деплое Vercel задаст вопросы:

```
? Set up and deploy "~/accelerator-mosobavuz"? [Y/n] y
? Which scope do you want to deploy to? Your Account
? Link to existing project? [y/N] n
? What's your project's name? accelerator-mosobavuz
? In which directory is your code located? ./client
```

#### Шаг 4: Production деплой

```bash
vercel --prod
```

Ваш сайт будет доступен по адресу: `https://accelerator-mosobavuz.vercel.app`

### Способ 2: Через Vercel Dashboard

#### Шаг 1: Загрузите проект на GitHub

```bash
# Инициализируйте Git (если еще не сделано)
git init
git add .
git commit -m "Initial commit"

# Создайте репозиторий на GitHub и загрузите код
git remote add origin https://github.com/your-username/accelerator-mosobavuz.git
git push -u origin main
```

#### Шаг 2: Подключите репозиторий к Vercel

1. Перейдите на [vercel.com](https://vercel.com)
2. Нажмите **"Add New Project"**
3. Выберите ваш GitHub репозиторий
4. Настройте параметры:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist`
5. Нажмите **"Deploy"**

#### Шаг 3: Автоматические деплои

Теперь при каждом push в GitHub, Vercel автоматически создаст новый деплой.

---

## Деплой на Netlify

**Netlify** - еще одна популярная платформа для статических сайтов.

### Способ 1: Drag & Drop (самый простой)

#### Шаг 1: Создайте сборку

```bash
cd client
pnpm build
```

#### Шаг 2: Загрузите на Netlify

1. Перейдите на [app.netlify.com/drop](https://app.netlify.com/drop)
2. Перетащите папку `client/dist` в окно браузера
3. Готово! Ваш сайт доступен по адресу `https://random-name.netlify.app`

### Способ 2: Через Netlify CLI

#### Шаг 1: Установка Netlify CLI

```bash
npm install -g netlify-cli
```

#### Шаг 2: Логин

```bash
netlify login
```

#### Шаг 3: Деплой

```bash
cd client

# Создайте сборку
pnpm build

# Деплой
netlify deploy --prod --dir=dist
```

### Способ 3: Через Git (автоматический деплой)

#### Шаг 1: Загрузите проект на GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/accelerator-mosobavuz.git
git push -u origin main
```

#### Шаг 2: Подключите к Netlify

1. Перейдите на [app.netlify.com](https://app.netlify.com)
2. Нажмите **"Add new site"** → **"Import an existing project"**
3. Выберите GitHub и ваш репозиторий
4. Настройте параметры:
   - **Base directory**: `client`
   - **Build command**: `pnpm build`
   - **Publish directory**: `client/dist`
5. Нажмите **"Deploy site"**

### Настройка переадресации для SPA

Создайте файл `client/public/_redirects`:

```
/*    /index.html   200
```

Это обеспечит корректную работу роутинга React.

---

## Деплой на GitHub Pages

**GitHub Pages** - бесплатный хостинг для статических сайтов прямо из репозитория GitHub.

### Шаг 1: Установка gh-pages

```bash
cd client
pnpm add -D gh-pages
```

### Шаг 2: Обновите package.json

Добавьте в `client/package.json`:

```json
{
  "homepage": "https://your-username.github.io/accelerator-mosobavuz",
  "scripts": {
    "predeploy": "pnpm build",
    "deploy": "gh-pages -d dist"
  }
}
```

### Шаг 3: Обновите конфигурацию Vite

В `client/vite.config.ts` добавьте:

```typescript
export default defineConfig({
  base: '/accelerator-mosobavuz/', // Имя вашего репозитория
  // ... остальная конфигурация
});
```

### Шаг 4: Деплой

```bash
cd client
pnpm deploy
```

Сайт будет доступен по адресу: `https://your-username.github.io/accelerator-mosobavuz`

### Шаг 5: Настройка GitHub Pages

1. Перейдите в Settings вашего репозитория
2. Откройте раздел **Pages**
3. В **Source** выберите ветку `gh-pages`
4. Нажмите **Save**

---

## Деплой на собственный сервер

Если у вас есть собственный VPS или сервер.

### Вариант 1: Nginx

#### Шаг 1: Создайте сборку

```bash
cd client
pnpm build
```

#### Шаг 2: Загрузите файлы на сервер

```bash
# Используйте SCP или SFTP
scp -r dist/* user@your-server.com:/var/www/accelerator-mosobavuz/
```

#### Шаг 3: Настройте Nginx

Создайте конфигурацию `/etc/nginx/sites-available/accelerator-mosobavuz`:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /var/www/accelerator-mosobavuz;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Кеширование статических файлов
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Gzip сжатие
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

#### Шаг 4: Активируйте конфигурацию

```bash
sudo ln -s /etc/nginx/sites-available/accelerator-mosobavuz /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Вариант 2: Apache

#### Шаг 1: Загрузите файлы

```bash
scp -r dist/* user@your-server.com:/var/www/html/accelerator-mosobavuz/
```

#### Шаг 2: Создайте .htaccess

В директории `/var/www/html/accelerator-mosobavuz/` создайте `.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Настройка HTTPS с Let's Encrypt

```bash
# Установите Certbot
sudo apt install certbot python3-certbot-nginx

# Получите сертификат
sudo certbot --nginx -d your-domain.com

# Автоматическое обновление
sudo certbot renew --dry-run
```

---

## Настройка домена

### Для Vercel

1. Перейдите в настройки проекта на Vercel
2. Откройте вкладку **Domains**
3. Добавьте ваш домен
4. Настройте DNS записи у вашего регистратора:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Для Netlify

1. Перейдите в настройки сайта на Netlify
2. Откройте **Domain management**
3. Нажмите **Add custom domain**
4. Настройте DNS:

```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: your-site.netlify.app
```

### Для собственного сервера

Настройте A-запись у вашего регистратора:

```
Type: A
Name: @
Value: [IP вашего сервера]

Type: A
Name: www
Value: [IP вашего сервера]
```

---

## 🔍 Проверка деплоя

После деплоя проверьте:

### 1. Функциональность
- ✅ Сайт открывается
- ✅ Все изображения загружаются
- ✅ Навигация работает
- ✅ Кнопки кликабельны

### 2. Производительность

Используйте [PageSpeed Insights](https://pagespeed.web.dev/):
- Цель: 90+ баллов на мобильных
- Цель: 95+ баллов на десктопе

### 3. SEO

Проверьте через [Google Search Console](https://search.google.com/search-console):
- Наличие meta тегов
- Корректные заголовки
- Мобильная адаптивность

### 4. Безопасность

- ✅ HTTPS включен
- ✅ Нет смешанного контента (mixed content)
- ✅ Безопасные заголовки настроены

---

## 🐛 Решение проблем при деплое

### Проблема: "404 при обновлении страницы"

**Решение**: Настройте переадресацию для SPA

**Vercel**: создайте `vercel.json` в корне:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**Netlify**: создайте `_redirects` в `public/`:
```
/*    /index.html   200
```

### Проблема: "Изображения не загружаются"

**Причина**: Неправильные пути к файлам

**Решение**: Используйте абсолютные пути:
```tsx
<img src="/assets/image.webp" alt="..." />
```

### Проблема: "CSS не применяется"

**Причина**: Неправильный `base` в vite.config.ts

**Решение**: Для GitHub Pages установите:
```typescript
base: '/repository-name/'
```

Для остальных платформ:
```typescript
base: '/'
```

### Проблема: "Ошибка сборки на CI/CD"

**Причина**: Недостаточно памяти или неправильная версия Node.js

**Решение**: Укажите версию Node.js в `.nvmrc`:
```
18.17.0
```

---

## 📊 Мониторинг после деплоя

### Google Analytics

Добавьте в `client/index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Sentry (мониторинг ошибок)

```bash
pnpm add @sentry/react
```

В `client/src/main.tsx`:

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production",
});
```

---

## 🎉 Готово!

Ваш проект успешно развернут! Теперь он доступен пользователям по всему миру.

Для обновления сайта просто повторите процесс деплоя или используйте автоматический деплой через Git.

**Удачи! 🚀**




---

## Интеграция с Битрикс24

**Битрикс24** - популярная CRM и платформа для бизнеса. Существует несколько способов интегрировать ваш лендинг с Битрикс24.

### Вариант 1: Встраивание через iframe (самый простой)

Этот способ позволяет встроить ваш лендинг как отдельную страницу в Битрикс24.

#### Шаг 1: Разверните лендинг на хостинге

Сначала разверните ваш лендинг на любом хостинге (Vercel, Netlify и т.д.) по инструкциям выше.

Пример: `https://accelerator.example.com`

#### Шаг 2: Создайте страницу в Битрикс24

1. Войдите в административную панель Битрикс24
2. Перейдите в **Сайты** → **Страницы**
3. Нажмите **"Создать страницу"**
4. Выберите **"Пустая страница"**

#### Шаг 3: Добавьте iframe код

В редакторе страницы переключитесь в режим HTML и вставьте:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Акселератор МОСОБАВУЗ</title>
    <style>
        body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
        }
        #landing-frame {
            width: 100%;
            height: 100vh;
            border: none;
            display: block;
        }
    </style>
</head>
<body>
    <iframe 
        id="landing-frame"
        src="https://accelerator.example.com"
        title="Акселератор МОСОБАВУЗ"
        loading="lazy">
    </iframe>
    
    <script>
        // Автоматическая подстройка высоты iframe
        window.addEventListener('message', function(e) {
            if (e.data.type === 'resize') {
                document.getElementById('landing-frame').style.height = e.data.height + 'px';
            }
        });
    </script>
</body>
</html>
```

#### Шаг 4: Настройте URL

В настройках страницы установите красивый URL:
- Например: `/accelerator/` или `/innovation/`

### Вариант 2: Размещение на поддомене Битрикс24

Если у вас есть собственный домен, подключенный к Битрикс24.

#### Шаг 1: Создайте поддомен

В настройках DNS вашего домена создайте A-запись:

```
Type: A
Name: accelerator
Value: [IP адрес вашего хостинга]
```

Или CNAME для Vercel/Netlify:

```
Type: CNAME
Name: accelerator
Value: your-site.vercel.app
```

#### Шаг 2: Настройте редирект в Битрикс24

В Битрикс24 создайте редирект:

1. Перейдите в **Настройки** → **Настройки продукта** → **Сайты**
2. Добавьте новый сайт с адресом `accelerator.yourdomain.com`
3. Настройте редирект на внешний URL

### Вариант 3: Интеграция форм с CRM Битрикс24

Подключите формы вашего лендинга к CRM Битрикс24 для сбора лидов.

#### Шаг 1: Получите webhook URL в Битрикс24

1. Перейдите в **CRM** → **Настройки** → **Веб-хуки**
2. Создайте входящий веб-хук с правами на создание лидов
3. Скопируйте URL вида: `https://your-portal.bitrix24.ru/rest/1/xxxxx/`

#### Шаг 2: Создайте обработчик формы

Создайте файл `client/src/lib/bitrix24.ts`:

```typescript
interface LeadData {
  name: string;
  email?: string;
  phone?: string;
  comments?: string;
}

export async function sendToBitrix24(data: LeadData) {
  const WEBHOOK_URL = 'https://your-portal.bitrix24.ru/rest/1/xxxxx/crm.lead.add.json';
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          TITLE: `Заявка с лендинга: ${data.name}`,
          NAME: data.name,
          EMAIL: data.email ? [{ VALUE: data.email, VALUE_TYPE: 'WORK' }] : [],
          PHONE: data.phone ? [{ VALUE: data.phone, VALUE_TYPE: 'WORK' }] : [],
          COMMENTS: data.comments || 'Заявка с лендинга Акселератор МОСОБАВУЗ',
          SOURCE_ID: 'WEB',
          SOURCE_DESCRIPTION: 'Лендинг акселератора',
        },
      }),
    });

    const result = await response.json();
    
    if (result.result) {
      return { success: true, leadId: result.result };
    } else {
      throw new Error(result.error_description || 'Ошибка создания лида');
    }
  } catch (error) {
    console.error('Ошибка отправки в Битрикс24:', error);
    return { success: false, error };
  }
}
```

#### Шаг 3: Обновите компонент формы

В `client/src/pages/Home.tsx` добавьте обработку формы:

```tsx
import { sendToBitrix24 } from '@/lib/bitrix24';
import { useState } from 'react';
import { toast } from 'sonner';

// Внутри компонента
const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsSubmitting(true);
  
  const formData = new FormData(e.currentTarget);
  const data = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    comments: formData.get('comments') as string,
  };
  
  const result = await sendToBitrix24(data);
  
  if (result.success) {
    toast.success('Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
    e.currentTarget.reset();
  } else {
    toast.error('Произошла ошибка. Попробуйте позже или свяжитесь с нами напрямую.');
  }
  
  setIsSubmitting(false);
};

// В JSX замените кнопки на форму:
<form onSubmit={handleSubmit} className="space-y-4">
  <input
    type="text"
    name="name"
    placeholder="Ваше имя"
    required
    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00D4FF]"
  />
  <input
    type="email"
    name="email"
    placeholder="Email"
    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00D4FF]"
  />
  <input
    type="tel"
    name="phone"
    placeholder="Телефон"
    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00D4FF]"
  />
  <textarea
    name="comments"
    placeholder="Комментарий"
    rows={3}
    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00D4FF]"
  />
  <Button 
    type="submit" 
    disabled={isSubmitting}
    className="bg-[#00D4FF] hover:bg-[#00b8e6] text-white px-12 py-6 rounded-full text-lg font-medium shadow-lg w-full"
  >
    {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
  </Button>
</form>
```

#### Шаг 4: Настройте переменные окружения

Создайте файл `client/.env`:

```env
VITE_BITRIX24_WEBHOOK_URL=https://your-portal.bitrix24.ru/rest/1/xxxxx/crm.lead.add.json
```

Обновите `bitrix24.ts`:

```typescript
const WEBHOOK_URL = import.meta.env.VITE_BITRIX24_WEBHOOK_URL;
```

### Вариант 4: Использование виджетов Битрикс24

Добавьте виджеты Битрикс24 (онлайн-чат, форма обратной связи) на ваш лендинг.

#### Шаг 1: Получите код виджета

1. В Битрикс24 перейдите в **CRM** → **Форма CRM**
2. Создайте новую форму или выберите существующую
3. Нажмите **"Встроить на сайт"**
4. Скопируйте код виджета

#### Шаг 2: Добавьте виджет на лендинг

В файл `client/index.html` перед закрывающим тегом `</body>` добавьте:

```html
<!-- Битрикс24 виджет -->
<script data-b24-form="inline/XX/XXXXX" data-skip-moving="true">
(function(w,d,u){
var s=d.createElement('script');s.async=true;s.src=u+'?'+(Date.now()/180000|0);
var h=d.getElementsByTagName('script')[0];h.parentNode.insertBefore(s,h);
})(window,document,'https://your-portal.bitrix24.ru/upload/crm/form/loader_XX_XXXXX.js');
</script>
```

#### Шаг 3: Настройте отображение виджета

Для открытия формы по клику на кнопку:

```tsx
const openBitrix24Form = () => {
  if (window.BX24 && window.BX24.openForm) {
    window.BX24.openForm('inline/XX/XXXXX');
  }
};

// В кнопке:
<Button onClick={openBitrix24Form}>
  Отправить заявку
</Button>
```

Добавьте типы в `client/src/vite-env.d.ts`:

```typescript
interface Window {
  BX24?: {
    openForm: (formId: string) => void;
  };
}
```

### Вариант 5: Интеграция через REST API

Для более сложной интеграции используйте REST API Битрикс24.

#### Возможности REST API:

- Создание лидов, контактов, компаний
- Создание задач и событий
- Работа с сделками
- Отправка уведомлений
- Работа с календарем

#### Пример: Создание задачи при отправке формы

```typescript
export async function createTask(title: string, description: string) {
  const WEBHOOK_URL = 'https://your-portal.bitrix24.ru/rest/1/xxxxx/tasks.task.add.json';
  
  const response = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fields: {
        TITLE: title,
        DESCRIPTION: description,
        RESPONSIBLE_ID: 1, // ID ответственного
        CREATED_BY: 1,
        PRIORITY: 1, // Высокий приоритет
      },
    }),
  });
  
  return await response.json();
}
```

### Вариант 6: Интеграция аналитики

Отслеживайте действия пользователей и отправляйте данные в Битрикс24.

#### Шаг 1: Установите Битрикс24 счетчик

В `client/index.html`:

```html
<!-- Битрикс24 Счетчик -->
<script>
(function(w,d,u,i,o,s,p){w[o]=w[o]||function(){(w[o].q=w[o].q||[]).push(arguments)};
s=d.createElement('script');s.async=1;s.src=u;p=d.getElementsByTagName('script')[0];
p.parentNode.insertBefore(s,p);})(window,document,'https://your-portal.bitrix24.ru/upload/crm/site_button/loader_X_XXXXX.js','b24Tracker','b24_tracker');
b24_tracker('init', 'XXXXX');
</script>
```

#### Шаг 2: Отслеживайте события

```typescript
// Отслеживание клика по кнопке
const trackButtonClick = (buttonName: string) => {
  if (window.b24_tracker) {
    window.b24_tracker('event', 'button_click', {
      button_name: buttonName,
      page: window.location.pathname,
    });
  }
};

// В компоненте:
<Button onClick={() => {
  trackButtonClick('Стать участником');
  // ... остальная логика
}}>
  Стать участником
</Button>
```

### Настройка CORS для Битрикс24

Если возникают проблемы с CORS при запросах к Битрикс24:

#### Решение 1: Использование прокси

Создайте серверный endpoint, который будет проксировать запросы:

```typescript
// Если обновите проект до web-db-user, можно добавить в server/
export async function POST(request: Request) {
  const data = await request.json();
  
  const response = await fetch(process.env.BITRIX24_WEBHOOK_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  return response;
}
```

#### Решение 2: Настройка CORS в Битрикс24

1. Перейдите в **Настройки** → **Настройки портала**
2. Найдите раздел **"Безопасность"**
3. Добавьте ваш домен в список разрешенных источников

### Тестирование интеграции

После настройки интеграции проверьте:

1. **Создание лидов**: Отправьте тестовую форму и проверьте, появился ли лид в CRM
2. **Виджеты**: Убедитесь, что виджет открывается и работает корректно
3. **Аналитика**: Проверьте, что события отслеживаются в Битрикс24
4. **Уведомления**: Настройте уведомления о новых лидах для менеджеров

### Полезные ссылки

- [Документация REST API Битрикс24](https://dev.1c-bitrix.ru/rest_help/)
- [Веб-хуки Битрикс24](https://dev.1c-bitrix.ru/rest_help/rest_sum/start.php)
- [CRM формы](https://dev.1c-bitrix.ru/rest_help/crm/crmform/)
- [Виджеты Битрикс24](https://dev.1c-bitrix.ru/learning/course/index.php?COURSE_ID=115)

### Рекомендации по безопасности

1. **Не храните webhook URL в коде**: Используйте переменные окружения
2. **Ограничьте права webhook**: Давайте только необходимые разрешения
3. **Валидируйте данные**: Проверяйте данные формы перед отправкой
4. **Используйте HTTPS**: Всегда используйте защищенное соединение
5. **Логируйте ошибки**: Отслеживайте неудачные попытки отправки

---

## 🎓 Дополнительные материалы

### Видео-уроки по интеграции с Битрикс24

- [Создание веб-хуков в Битрикс24](https://www.youtube.com/bitrix24)
- [Настройка CRM форм](https://www.youtube.com/bitrix24)
- [REST API для начинающих](https://www.youtube.com/bitrix24)

### Примеры кода

Полные примеры интеграции доступны в официальной документации Битрикс24 и на GitHub.

---

**Готово!** Теперь ваш лендинг полностью интегрирован с Битрикс24 и готов к сбору лидов! 🎉

