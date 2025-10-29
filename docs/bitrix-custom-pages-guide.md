# Цель и рамки

Полный, практичный гайд по созданию **кастомных страниц на Bitrix**, когда:

* нужны **полные кастомные дизайны** (без стандартной вёрстки от компонентов);
* **не используем** концепцию «островов» (никаких вкраплений React в готовую PHP-вёрстку);
* поддерживаем **два трека**:

  1. **HTML-трек** — кастомный сайт-шаблон + кастомные шаблоны компонентов (PHP/HTML/CSS/JS);
  2. **React-трек (headless)** — **отдельный фронт-репозиторий** (Next.js/Vite/CRA), Bitrix выступает **API-бэкендом**; релизы фронта независимы от релизов Bitrix.

---

# Общая архитектурная картина

* **Данные/бизнес-логика**: Bitrix (модули, ORM, инфоблоки/HL-блоки, корзина и т.п.).
* **API-слой**: D7-контроллеры + действия (AJAX) → отдают JSON/файлы/потоки.
* **Фронт**:

  * HTML-трек: Bitrix рендерит страницы целиком из **кастомных шаблонов компонентов** внутри вашего **site-template**;
  * React-трек: фронт (Next.js) собирается и деплоится **отдельно**, общаясь с Bitrix через API.

---

# Часть I. HTML-трек (полный кастом внутри Bitrix)

## 1. Базовая структура проекта

```
/local
  /components/                # (опционально) ваши собственные компоненты
  /templates/<site>/          # ваш сайт-шаблон (шапка/подвал/сетку — сюда)
    /assets/                  # ваши CSS/JS/шрифты/изображения
    /components/bitrix/       # КАСТОМНЫЕ шаблоны стандартных компонентов
      /news.list/card-grid/
        template.php
        result_modifier.php
        component_epilog.php  # опционально
        style.css / script.js # специфичные ассеты
    header.php
    footer.php
    styles.css
    scripts.js
/bitrix                        # ядро (не трогаем)
```

**Принцип**: ничего не правим в `/bitrix`. Всё пользовательское — в `/local`.

## 2. Шаблон сайта (site-template)

* Весь макет (шапка, подвал, гриды, контейнеры, типографика) живёт в `/local/templates/<site>/`.
* Подключение ассетов — через **Asset Manager**:

  ```php
  use Bitrix\Main\Page\Asset;
  Asset::getInstance()->addCss(SITE_TEMPLATE_PATH.'/assets/css/app.css');
  Asset::getInstance()->addJs(SITE_TEMPLATE_PATH.'/assets/js/app.js');
  ```
* Разбейте стили: base (reset/variables), layout (grid), components (UI-киты), pages (page-specific).

## 3. Кастомные шаблоны компонентов

* Копируйте нужный шаблон компонента в путь вида:
  `/local/templates/<site>/components/bitrix/<компонент>/<имя_шаблона>/`
* Выберите этот шаблон в настройках компонента на странице.
* Структура мини-шаблона:

  ```
  template.php            # чистая семантическая HTML/BEM-вёрстка
  result_modifier.php     # подготовка $arResult под нужный дизайн/DTO
  component_epilog.php    # пост-логика после кеша (по надобности)
  style.css / script.js   # специфичные ассеты шаблона
  ```

### 3.1. template.php — только разметка/структура

Включите frameMode для совместимости с кешем/композитом:

```php
<?php if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED!==true) die();
$this->setFrameMode(true); ?>
<section class="cards">
  <?php foreach ($arResult['ITEMS'] as $item): ?>
    <article class="card">
      <h3 class="card__title"><?=htmlspecialcharsbx($item['TITLE'])?></h3>
      <p class="card__text"><?=htmlspecialcharsbx($item['PREVIEW_TEXT'])?></p>
    </article>
  <?php endforeach; ?>
</section>
```

### 3.2. result_modifier.php — адаптация данных под вёрстку

```php
<?php
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED!==true) die();
foreach ($arResult['ITEMS'] as &$item) {
    $item['TITLE'] = $item['~NAME'] ?? $item['NAME'] ?? '';
    // пример приведения: форматируем цены/даты/ссылки, собираем DTO
}
```

### 3.3. component_epilog.php — «хвосты» (опционально)

* Установка метатегов, подключение трекеров, расчёт хлебных крошек.
* Важно: код исполняется **на каждом хите** (вне кеша шаблона).

## 4. Формы и корзина (без React)

* Используйте стандартные компоненты форм/корзины, но с **кастомными шаблонами**.
* JS-валидация/маски/UX — в ваших ассетах. Серверная валидация — в компоненте/обработчике.
* Для AJAX-поведения у стандартных компонентов — в шаблоне аккуратно подключайте JS-хендлеры; возвращайте компактные HTML-фрагменты или JSON через включаемые области/мини-компоненты.

## 5. Производительность и кеш

* Включайте `$this->setFrameMode(true)` в каждом шаблоне.
* Следите, чтобы **динамические** куски (счётчики, персонализация) не ломали кеш страницы.
* Готовьте `$arResult` максимально «плоским» в `result_modifier.php` (меньше работы в `template.php`).
* Включайте/настраивайте кеш компонентов (по времени и по ключам).

## 6. SEO/маркетинг

* Метаданные (title/description/h1) — проставляйте в `component_epilog.php` или из включаемых областей.
* ЧПУ-шаблоны и правила — через настройки компонента/модуля и URL-Rewrite.
* Схемы/микроразметка — генерируйте в `template.php` (JSON-LD).

## 7. Тестирование и CI/CD

* Юнит-тесты PHP (в т.ч. на формат $arResult).
* Визуальные регрессионные тесты (Backstop/Chromatic-аналог через Puppeteer).
* Сборка и минификация ассетов в pipeline; деплой `/local/templates/<site>/assets` атомарно.

---

# Часть II. React-трек (HEADLESS, отдельные релизы фронта)

**Цель:** фронт — это **отдельный проект** (Next.js/Vite/CRA), деплоится независимо, Bitrix отдаёт API. Никаких PHP-шаблонов для вёрстки страниц.

## 1. Архитектура

* **Bitrix-бэкенд**: бизнес-логика, ORM, инфоблоки/HL-блоки, сессии/пользователи.
* **API-слой в Bitrix**: D7-контроллеры и действия (`/bitrix/services/main/ajax.php?action=vendor.module.api…`).
* **Фронт (Next.js)**: SSR/SSG/ISR для SEO-страниц, CSR для интерактива. Деплой отдельно (Vercel/Docker/K8s/VM/CDN).

## 2. Проектирование API

### 2.1. Версионирование и контракты

* Простая схема: `action=vendor.module.api.v1.catalog.list`.
* Документируйте ответы (JSON Schema/OpenAPI). Храните DTO отдельно от ORM-моделей.

### 2.2. Контроллер (скелет)

```php
// /bitrix/modules/vendor.module/lib/controller/catalog.php
namespace Vendor\Module\Controller;

use Bitrix\Main\Engine\Controller;
use Bitrix\Main\Engine\ActionFilter;

class Catalog extends Controller
{
    public function configureActions(): array
    {
        return [
            'list' => [
                'prefilters' => [
                    new ActionFilter\HttpMethod([ActionFilter\HttpMethod::METHOD_GET]),
                    new ActionFilter\Cors('https://app.example.com', true), // whitelist фронта
                    new ActionFilter\Authentication(),                      // при необходимости
                ],
            ],
        ];
    }

    public function listAction(int $page = 1, int $limit = 20): array
    {
        // ORM/инфоблоки → DTO
        return [
            'items' => [/* ... */],
            'page'  => $page,
            'limit' => $limit,
            'total' => 123,
        ];
    }
}
```

**Советы:**

* В `configureActions()` добавляйте фильтры: `Cors`, `HttpMethod`, `Csrf`, `Authentication`, `RateLimit` (если используете кастомный), `ContentType`.
* Возвращайте только **DTO**, не «сырые» массивы ядра.

### 2.3. Безопасность, сессии и CSRF

* Один домен/поддомен → cookie-сессия + `credentials: 'include'`.
* Разные домены → **CORS + SameSite=None; Secure** для PHPSESSID.
* CSRF для state-изменяющих методов: заголовок `X-Bitrix-Csrf-Token` или `sessid` в параметрах.

### 2.4. Авторизация

* Вариант A: родная сессия Bitrix (простые проекты, админка/ЛК на том же домене).
* Вариант B: свой JWT-слой поверх Bitrix (отдельный домен, мобильные клиенты).

### 2.5. Файлы/медиа

* Отдавайте presigned-URL или статический CDN-префикс.
* Загрузки через выделенное действие, проверяющее права и размер/тип.

## 3. React/Next.js фронт

### 3.1. Структура проекта (пример Next.js)

```
app/
  (marketing)/
    layout.tsx
    page.tsx               # SSR/SSG/ISR страницы
  (shop)/
    products/
      page.tsx
    product/[slug]/
      page.tsx
lib/api.ts                 # обёртка над fetch к Bitrix API
lib/config.ts              # ENV/константы (API_ORIGIN, маршруты)
components/ui/*            # дизайн-система
components/sections/*      # независимые секции
styles/*                   # глобальные/модульные стили
```

### 3.2. Вызовы API

```ts
// lib/api.ts
export async function api<T>(action: string, params: Record<string, any> = {}, init?: RequestInit) {
  const url = new URL('/bitrix/services/main/ajax.php', process.env.NEXT_PUBLIC_API_ORIGIN);
  url.searchParams.set('action', action);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));
  const res = await fetch(url, {
    ...init,
    credentials: 'include',
    headers: { 'Accept': 'application/json', ...(init?.headers || {}) },
    cache: 'no-store', // или revalidate в Next 13+
  });
  const json = await res.json();
  if (json.status !== 'success') throw new Error(json.errors?.[0]?.message || 'API error');
  return json.data as T;
}
```

### 3.3. SSR/SSG/ISR

* SEO-страницы (карточки/категории/блог) — SSR/SSG/ISR.
* Часто обновляющиеся — ISR с `revalidate`.
* Кабинеты/корзина — CSR (client components) + SWR/React-Query.

### 3.4. Маршрутизация и ЧПУ

* ЧПУ держим на фронте; на бэке — действия принимают ID/slug.
* Синхронизацию sitemap/robots делаем в фронтовом проекте (эндпоинты `/sitemap.xml`, `/robots.txt`) с данными из Bitrix API.

### 3.5. Стили/дизайн-система

