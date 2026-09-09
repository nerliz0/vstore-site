# Vstore site

Статический магазин цифровых товаров для GitHub Pages. Сайт работает без сборщика: HTML подключает обычные CSS- и JavaScript-файлы, каталог загружается из Supabase, а локальные данные позволяют продолжить работу при недоступности API.

## Локальный запуск

```bash
python3 -m http.server 8000
```

После запуска сайт доступен по адресу `http://localhost:8000/`.

## Структура

- `index.html` — главная и популярные товары.
- `catalog.html` — каталог, поиск и фильтры.
- `product.html?item=<slug>` — карточка, варианты и оформление товара.
- `faq.html` — вопросы и ответы.
- `admin.html` — защищённый редактор Supabase.
- `js/products-data.js` — аварийный локальный каталог.
- `js/supabase-products.js` — загрузка публичного каталога из Supabase.
- `js/cart.js` и `js/favorites.js` — корзина, последние заказы и избранное в `localStorage`.
- `js/steam-keys.js` и `js/steam-topup.js` — ключи игр и пополнение.
- `supabase/schema.sql` — таблицы, индексы, триггеры и RLS-политики.

## Источники данных

При успешном запросе таблица `products` является источником публичного каталога, включая корректный пустой результат. Если Supabase или его CDN недоступны либо запрос завершился ошибкой, используется `window.VSTORE_PRODUCTS` из `js/products-data.js`.

Основные поля `products`:

- `slug`, `title`, `category`, `filters`, `aliases`, `items`;
- `image`, `featured_image`, `featured_mobile_image`, `featured_title`;
- `price_from`, `description`, `accent`, `accent_rgb`, `watermark`;
- `benefits jsonb`, `details jsonb`, `prices jsonb`, `regions jsonb`;
- `active`, `sort_order`.

Фильтры каталога: `games`, `subs`, `cards`, `topup`. Один товар может относиться к нескольким фильтрам.

Ключи игр находятся в `steam_keys`. Поле `platform` принимает `steam`, `rockstar`, `xbox-keys` или `psn-keys`, а `editions jsonb` хранит варианты вида:

```json
{
  "name": "Standard Edition",
  "region": "Global",
  "priceLabel": "1 490 ₽",
  "priceValue": 1490,
  "note": ""
}
```

После создания проекта Supabase выполните `supabase/schema.sql`. Если старая база не содержит `platform`, дополнительно можно выполнить `supabase/patch-steam-keys-platform.sql`. Затем создайте пользователя в Supabase Authentication и добавьте его `user_id` в `admin_users`.

Публичный publishable/anon key хранится в `js/supabase-config.js`. Доступ к изменениям защищается RLS, а админка дополнительно проверяет `admin_users` до показа редактора.

## Cache-busting

Все локальные CSS и JS в HTML используют один release-токен. Текущее значение хранится в `package.json` в поле `vstoreRelease`. Перед публикацией изменения локальных ресурсов:

1. замените `?v=...` во всех HTML на новое единое значение;
2. обновите `vstoreRelease` тем же значением;
3. запустите `npm test` — тест отклонит смешанные или пропущенные версии.

## Проверка

```bash
npm test
npm run check
```

`npm test` проверяет каталог, локальные ресурсы, единый cache-busting, JavaScript, схему Supabase и базовую работу корзины. `npm run check` дополнительно запускает `git diff --check`.

Перед публикацией вручную проверьте главную, фильтры, поиск, страницу товара, корзину, Telegram-сообщение, FAQ и вход в админку на широком и мобильном экране.
