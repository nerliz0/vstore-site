(function () {
  "use strict";

  window.VSTORE_PRODUCTS = [
    {
      slug: "fortnite",
      title: "Fortnite",
      category: "Игры",
      filters: ["games", "topup"],
      image: "assets/catalog/featured-fortnite-desktop.jpg",
      featuredImage: "assets/catalog/featured-fortnite-desktop.jpg",
      featuredMobileImage: "assets/catalog/featured-fortnite-mobile.jpg",
      featuredTitle: "Fortnite Crew",
      aliases: ["Фортнайт", "Фортнайт Крю", "Фортнайт Crew", "В баксы", "Вбаксы", "В-баксы", "боевой пропуск"],
      items: ["Crew", "V-Bucks", "Battle Pass"],
      priceFrom: "от 299 ₽",
      description: "Раздел с популярными товарами Fortnite. Менеджер подскажет актуальные позиции, наличие и удобный способ выдачи.",
      prices: [
        {
          title: "Основные позиции",
          rows: [
            ["Fortnite Crew", "от 299 ₽"],
            ["V-Bucks", "по запросу"],
            ["Battle Pass", "по запросу"]
          ]
        }
      ]
    },
    {
      slug: "pubg-battlegrounds",
      title: "PUBG Battlegrounds",
      category: "Игры",
      filters: ["games", "topup"],
      image: "assets/catalog/pubg-battlegrounds.avif",
      aliases: ["Пабг", "Пабджи", "Пубг", "Пабг мобайл", "PUBG Mobile", "ПАБГ", "ЮСИ", "UC", "Г коин", "G-Coin", "GC"],
      items: ["UC", "Prime", "Пополнение"],
      priceFrom: "от 90 ₽",
      description: "Пополнения и игровые товары PUBG с ручной проверкой перед выдачей.",
      prices: [
        {
          title: "PUBG Mobile UC",
          rows: [
            ["60 UC", "90 ₽"],
            ["325 UC", "440 ₽"],
            ["660 UC", "820 ₽"],
            ["1800 UC", "2000 ₽"],
            ["3850 UC", "4000 ₽"],
            ["8100 UC", "7500 ₽"]
          ]
        },
        {
          title: "PUBG GC",
          rows: [
            ["100 GC", "90 ₽"],
            ["500 + 10 GC", "420 ₽"],
            ["1000 + 50 GC", "900 ₽"],
            ["2500 + 200 GC", "1900 ₽"],
            ["5000 + 500 GC", "3700 ₽"],
            ["10000 + 1200 GC", "7300 ₽"]
          ]
        }
      ]
    },
    {
      slug: "minecraft",
      title: "Minecraft",
      category: "Игры",
      filters: ["games", "topup"],
      image: "assets/catalog/minecraft.avif",
      aliases: ["Майнкрафт", "Майн", "Майнкоины", "Minecoins", "бедрок", "джава"],
      items: ["Java", "Bedrock", "Minecoins"],
      priceFrom: "от 470 ₽",
      description: "Цифровые товары Minecraft: версии игры, внутриигровые покупки и подарочные варианты.",
      prices: [
        {
          title: "Minecraft Minecoins",
          rows: [
            ["330 MC", "470 ₽"],
            ["1720 MC", "590 ₽"],
            ["3500 MC", "1070 ₽"],
            ["8800 MC", "3400 ₽"]
          ]
        }
      ]
    },
    {
      slug: "discord",
      title: "Discord",
      category: "Подписки",
      filters: ["subs"],
      image: "assets/catalog/ds.png",
      featuredImage: "assets/catalog/featured-discord-desktop.jpg",
      featuredMobileImage: "assets/catalog/featured-discord-mobile.jpg",
      featuredTitle: "Discord Nitro",
      aliases: ["Дискорд", "Дискорд нитро", "Нитро", "Нитро бейсик", "Нитро basic"],
      items: ["Nitro", "Nitro Basic", "Gift"],
      priceFrom: "от 179 ₽",
      description: "Discord Nitro и подарочные варианты. Перед оформлением менеджер уточнит способ активации.",
      prices: [
        {
          title: "Discord",
          rows: [
            ["Nitro", "от 179 ₽"],
            ["Nitro Basic", "по запросу"],
            ["Gift", "по запросу"]
          ]
        }
      ]
    },
    {
      slug: "riot-games",
      title: "Riot Games",
      category: "Игры",
      filters: ["games", "topup"],
      image: "assets/catalog/rout.jpg",
      aliases: ["Риот", "Риот геймс", "League of Legends", "Лига легенд", "Лол", "Валорант", "Валик", "RP", "VP"],
      items: ["RP", "VP", "Пополнение"],
      priceFrom: "от 250 ₽",
      description: "Пополнения для сервисов Riot Games. Доступность зависит от региона и текущих способов оплаты.",
      prices: [
        {
          title: "Riot Access TR",
          rows: [
            ["120 TR", "250 ₽"],
            ["250 TR", "500 ₽"],
            ["500 TR", "950 ₽"],
            ["850 TR", "1499 ₽"],
            ["1230 TR", "2200 ₽"],
            ["2450 TR", "4400 ₽"]
          ]
        }
      ]
    },
    {
      slug: "battlefield-6",
      title: "Battlefield 6",
      category: "Игры",
      filters: ["games", "topup"],
      image: "assets/catalog/battla.jpg",
      aliases: ["Батлфилд", "Бателфилд", "Батла", "Battlefield", "БФ", "BF6", "BFC"],
      items: ["Edition", "Key", "Gift"],
      priceFrom: "от 790 ₽",
      description: "Раздел Battlefield с внутриигровой валютой, ключами, подарочными вариантами и доступными изданиями по запросу.",
      prices: [
        {
          title: "Battlefield 6 BFC",
          rows: [
            ["1100 BFC", "790 ₽"],
            ["2400 BFC", "1590 ₽"],
            ["5000 BFC", "2970 ₽"],
            ["13000 BFC", "7500 ₽"]
          ]
        }
      ]
    },
    {
      slug: "valorant",
      title: "Valorant",
      category: "Игры",
      filters: ["games", "topup"],
      image: "assets/catalog/valorant.jpg",
      aliases: ["Валорант", "Валик", "ВП", "Valorant Points", "VP", "Riot"],
      items: ["Points", "Battle Pass", "Gift"],
      priceFrom: "от 350 ₽",
      description: "Valorant Points и другие позиции для аккаунта. Перед оплатой менеджер проверит регион.",
      prices: [
        {
          title: "Valorant Points",
          rows: [
            ["375 VP", "350 ₽"],
            ["825 VP", "520 ₽"],
            ["1700 VP", "950 ₽"],
            ["2925 VP", "1590 ₽"],
            ["4325 VP", "2250 ₽"],
            ["8900 VP", "4450 ₽"]
          ]
        }
      ]
    },
    {
      slug: "xbox-game-pass",
      title: "Xbox Game Pass",
      category: "Подписки",
      filters: ["subs"],
      image: "assets/catalog/xbox.png",
      aliases: ["Иксбокс", "Хбокс", "Гейм пасс", "Геймпасс", "Xbox Ultimate", "Gamepass"],
      items: ["Game Pass", "Ultimate", "Gift"],
      priceFrom: "от 3500 ₽",
      description: "Подписки Xbox Game Pass и подарочные варианты. Подходит для игровых аккаунтов с нужным регионом.",
      prices: [
        {
          title: "Xbox Game Pass Ultimate TR",
          rows: [["3 Months", "3500 ₽"]]
        }
      ]
    },
    {
      slug: "telegram-premium",
      title: "Telegram Premium",
      category: "Подписки",
      filters: ["subs"],
      image: "assets/catalog/telegram-premium.jpg",
      aliases: ["Телеграм", "Телега", "Тг премиум", "ТГ", "Telegram", "Premium"],
      items: ["Premium", "Gift", "Аккаунт"],
      priceFrom: "от 1100 ₽",
      description: "Telegram Premium для личного аккаунта или подарком. Менеджер уточнит удобный формат оформления.",
      prices: [
        {
          title: "Telegram Premium",
          rows: [
            ["3 Months", "1100 ₽"],
            ["6 Months", "1470 ₽"],
            ["12 Months", "2600 ₽"]
          ]
        }
      ]
    },
    {
      slug: "app-store",
      title: "App Store",
      category: "Карты",
      filters: ["cards", "topup"],
      image: "assets/catalog/app-store.png",
      aliases: ["Апп стор", "Апстор", "Айтюнс", "Итюнс", "iTunes", "Apple", "Эпл", "подарочная карта"],
      items: ["Gift Card", "Balance", "Region"],
      priceFrom: "от 23 ₽",
      description: "Подарочные карты App Store. Важно заранее выбрать правильный регион аккаунта.",
      prices: [
        {
          title: "App Store & iTunes TR",
          rows: [
            ["10 TRY", "23 ₽"],
            ["15 TRY", "35 ₽"],
            ["20 TRY", "45 ₽"],
            ["25 TRY", "56 ₽"],
            ["30 TRY", "68 ₽"],
            ["40 TRY", "90 ₽"],
            ["50 TRY", "108 ₽"],
            ["75 TRY", "158 ₽"],
            ["100 TRY", "205 ₽"],
            ["150 TRY", "292 ₽"],
            ["200 TRY", "402 ₽"],
            ["250 TRY", "478 ₽"],
            ["300 TRY", "603 ₽"],
            ["400 TRY", "804 ₽"],
            ["500 TRY", "955 ₽"],
            ["600 TRY", "1168 ₽"],
            ["750 TRY", "1508 ₽"],
            ["799 TRY", "1578 ₽"],
            ["1000 TRY", "1912 ₽"],
            ["1250 TRY", "2399 ₽"],
            ["1500 TRY", "2878 ₽"],
            ["1750 TRY", "3448 ₽"],
            ["2000 TRY", "3942 ₽"]
          ]
        }
      ]
    },
    {
      slug: "psn",
      title: "PSN",
      category: "Карты",
      filters: ["cards", "topup"],
      image: "assets/catalog/psn.jpg",
      featuredImage: "assets/catalog/featured-playstation-desktop.jpg?v=20260727-3",
      featuredMobileImage: "assets/catalog/featured-playstation-mobile.jpg",
      featuredTitle: "PlayStation Gift Card",
      aliases: ["Плейстейшен", "Плейстешен", "Плейстэйшен", "ПСН", "ПС", "PlayStation", "PS", "PSN", "подарочная карта"],
      items: ["Gift Card", "Plus", "Wallet"],
      priceFrom: "от 470 ₽",
      description: "Подарочные карты и позиции PlayStation. Регион аккаунта нужно проверить до оплаты.",
      prices: [
        {
          title: "PlayStation TR",
          rows: [
            ["250 TRY", "470 ₽"],
            ["500 TRY", "940 ₽"],
            ["750 TRY", "1410 ₽"],
            ["1000 TRY", "1880 ₽"],
            ["1500 TRY", "2820 ₽"],
            ["2000 TRY", "3760 ₽"],
            ["2500 TRY", "4700 ₽"],
            ["3000 TRY", "5640 ₽"],
            ["4000 TRY", "7520 ₽"],
            ["5000 TRY", "9400 ₽"]
          ]
        }
      ]
    },
    {
      slug: "steam",
      title: "Steam",
      category: "Карты",
      filters: ["cards", "topup"],
      image: "assets/catalog/steam.jpg",
      aliases: ["Стим", "Steam Wallet", "Стим гифт", "Стим кошелек", "ключи", "гифт"],
      items: ["Gift", "Wallet", "Keys"],
      priceFrom: "по запросу",
      description: "Steam Gift, пополнение кошелька и ключи. Менеджер уточнит регион и доступность позиции.",
      prices: [
        {
          title: "Steam",
          rows: [
            ["Steam Gift", "по запросу"],
            ["Wallet", "по запросу"],
            ["Keys", "по запросу"]
          ]
        }
      ]
    }
  ];
})();
