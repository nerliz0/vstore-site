(function () {
  "use strict";

  window.VSTORE_PRODUCTS = [
    {
      slug: "fortnite",
      title: "Fortnite",
      category: "Игры",
      filters: ["games", "topup"],
      image: "assets/catalog/fortnite-vstore.png",
      featuredImage: "assets/catalog/featured-fortnite-desktop.jpg",
      featuredMobileImage: "assets/catalog/featured-fortnite-mobile.jpg",
      featuredTitle: "Fortnite Crew",
      aliases: ["Фортнайт", "Фортнайт Крю", "Фортнайт Crew", "В баксы", "Вбаксы", "В-баксы", "боевой пропуск"],
      items: ["Crew", "V-Bucks", "Battle Pass"],
      priceFrom: "от 299 ₽",
      description: "Раздел с популярными товарами Fortnite. Менеджер подскажет актуальные позиции, наличие и удобный способ выдачи.",
      accent: "#8b5cf6",
      accentRgb: "139, 92, 246",
      watermark: "FORTNITE",
      benefits: [
        { icon: "✓", label: "Официальное оформление" },
        { icon: "↯", label: "Активация вручную" },
        { icon: "◇", label: "Без скрытых списаний" },
        { icon: "◎", label: "Гарантия на срок" }
      ],
      details: [
        "Оформление подписки Fortnite «Отряд» (Crew) на ваш аккаунт.",
        "Покупка осуществляется официально с личной банковской карты Турции. Нет риска блокировок или списаний.",
        "Чтобы купить, оплатите заказ -> предоставьте данные для входа в ваш аккаунт Xbox/Epic Games -> ожидайте активации подписки."
      ],
      guarantee: "Гарантия на весь срок подписки",
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
      image: "assets/catalog/pubg-vstore.png",
      aliases: ["Пабг", "Пабджи", "Пубг", "Пабг мобайл", "PUBG Mobile", "ПАБГ", "ЮСИ", "UC", "Г коин", "G-Coin", "GC"],
      items: ["UC", "Prime", "Пополнение"],
      priceFrom: "от 90 ₽",
      description: "Пополнения и игровые товары PUBG с ручной проверкой перед выдачей.",
      accent: "#8b5cf6",
      accentRgb: "139, 92, 246",
      watermark: "PUBG",
      benefits: [
        { icon: "✓", label: "Коды и пополнение" },
        { icon: "↯", label: "Безопасная выдача" },
        { icon: "◇", label: "Под любой регион" },
        { icon: "◎", label: "24 часа гарантии" }
      ],
      details: [
        "Подарочная карта (код) или оформление подписки для PUBG.",
        "Подходит для любого региона. Нет необходимости передавать данные от аккаунта, пополнение происходит безопасно.",
        "Чтобы купить, оплатите заказ -> укажите ваш игровой ID для подписки или активируйте полученный код в игре."
      ],
      guarantee: "24-часовая гарантия",
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
      image: "assets/catalog/minecraft-vstore.png",
      aliases: ["Майнкрафт", "Майн", "Майнкоины", "Minecoins", "бедрок", "джава"],
      items: ["Java", "Bedrock", "Minecoins"],
      priceFrom: "от 470 ₽",
      description: "Цифровые товары Minecraft: версии игры, внутриигровые покупки и подарочные варианты.",
      accent: "#8b5cf6",
      accentRgb: "139, 92, 246",
      watermark: "MINECRAFT",
      benefits: [
        { icon: "✓", label: "Код для активации" },
        { icon: "↯", label: "Без передачи аккаунта" },
        { icon: "◇", label: "Без VPN и карт" },
        { icon: "◎", label: "24 часа гарантии" }
      ],
      details: [
        "Подарочная карта (код) для игры Minecraft.",
        "Подходит для любого региона. Не нужно добавлять карты, использовать VPN или передавать аккаунт.",
        "Чтобы активировать, получите код -> зайдите на официальный сайт или в лаунчер -> активируйте код."
      ],
      guarantee: "24-часовая гарантия",
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
      image: "assets/catalog/discord-vstore.png",
      featuredImage: "assets/catalog/featured-discord-desktop.jpg",
      featuredMobileImage: "assets/catalog/featured-discord-mobile.jpg",
      featuredTitle: "Discord Nitro",
      aliases: ["Дискорд", "Дискорд нитро", "Нитро", "Нитро бейсик", "Нитро basic"],
      items: ["Nitro", "Nitro Basic", "Gift"],
      priceFrom: "от 179 ₽",
      description: "Discord Nitro и подарочные варианты. Перед оформлением менеджер уточнит способ активации.",
      accent: "#8b5cf6",
      accentRgb: "139, 92, 246",
      watermark: "DISCORD",
      benefits: [
        { icon: "✓", label: "Nitro Full и Basic" },
        { icon: "↯", label: "QR-вход по желанию" },
        { icon: "◇", label: "Оплата картой TR" },
        { icon: "◎", label: "Гарантия на срок" }
      ],
      details: [
        "Оформление подписки Discord Nitro Full или Basic на ваш аккаунт.",
        "Покупка осуществляется безопасно с личной банковской карты Турции.",
        "Чтобы купить, оплатите заказ -> предоставьте данные для входа в Discord или вход по QR-коду -> ожидайте активации."
      ],
      guarantee: "Гарантия на весь срок подписки",
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
      image: "assets/catalog/riot-vstore-224x165.png",
      aliases: ["Риот", "Риот геймс", "League of Legends", "Лига легенд", "Лол", "Валорант", "Валик", "RP", "VP"],
      items: ["RP", "VP", "Пополнение"],
      priceFrom: "от 250 ₽",
      description: "Пополнения для сервисов Riot Games. Доступность зависит от региона и текущих способов оплаты.",
      accent: "#8b5cf6",
      accentRgb: "139, 92, 246",
      watermark: "RIOT",
      benefits: [
        { icon: "✓", label: "Код пополнения" },
        { icon: "↯", label: "Без входа в аккаунт" },
        { icon: "◇", label: "League, TFT и другое" },
        { icon: "◎", label: "24 часа гарантии" }
      ],
      details: [
        "Подарочная карта (код) пополнения баланса Riot Games: League of Legends, TFT и другие игры.",
        "Подходит для любого региона. Без передачи данных от вашего аккаунта.",
        "Чтобы активировать, получите код -> зайдите в клиент игры -> выберите пополнение кодом и активируйте его."
      ],
      guarantee: "24-часовая гарантия",
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
      image: "assets/catalog/battlefield-vstore-224x165.png",
      aliases: ["Батлфилд", "Бателфилд", "Батла", "Battlefield", "БФ", "BF6", "BFC"],
      items: ["Edition", "Key", "Gift"],
      priceFrom: "от 790 ₽",
      description: "Раздел Battlefield с внутриигровой валютой, ключами, подарочными вариантами и доступными изданиями по запросу.",
      accent: "#8b5cf6",
      accentRgb: "139, 92, 246",
      watermark: "BATTLEFIELD",
      benefits: [
        { icon: "✓", label: "Коды валюты" },
        { icon: "↯", label: "EA, Steam, консоли" },
        { icon: "◇", label: "Без передачи аккаунта" },
        { icon: "◎", label: "24 часа гарантии" }
      ],
      details: [
        "Подарочная карта (код) игровой валюты для серии игр Battlefield.",
        "Подходит для любого региона. Безопасное получение без передачи данных от вашего аккаунта.",
        "Чтобы купить, получите код -> активируйте его на вашей игровой платформе EA App, Steam или консоль -> валюта зачислится на баланс."
      ],
      guarantee: "24-часовая гарантия",
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
      image: "assets/catalog/valorant-vstore-224x165.png",
      aliases: ["Валорант", "Валик", "ВП", "Valorant Points", "VP", "Riot"],
      items: ["Points", "Battle Pass", "Gift"],
      priceFrom: "от 350 ₽",
      description: "Valorant Points и другие позиции для аккаунта. Перед оплатой менеджер проверит регион.",
      accent: "#8b5cf6",
      accentRgb: "139, 92, 246",
      watermark: "VALORANT",
      benefits: [
        { icon: "✓", label: "Valorant Points" },
        { icon: "↯", label: "Код для магазина" },
        { icon: "◇", label: "Без входа в аккаунт" },
        { icon: "◎", label: "24 часа гарантии" }
      ],
      details: [
        "Подарочная карта (код) пополнения Valorant Points (VP).",
        "Подходит для любого региона. Без передачи данных от вашего аккаунта.",
        "Чтобы купить, получите код -> зайдите в игру Valorant -> перейдите в магазин и активируйте код."
      ],
      guarantee: "24-часовая гарантия",
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
      image: "assets/catalog/xbox-game-pass-vstore-224x165.png",
      aliases: ["Иксбокс", "Хбокс", "Гейм пасс", "Геймпасс", "Xbox Ultimate", "Gamepass"],
      items: ["Турция", "США", "Подписки"],
      priceFrom: "от 770 ₽",
      description: "Подписки Xbox Game Pass для разных регионов. Выберите страну аккаунта, срок и подходящий тариф.",
      accent: "#8b5cf6",
      accentRgb: "139, 92, 246",
      watermark: "XBOX",
      benefits: [
        { icon: "✓", label: "Game Pass Ultimate" },
        { icon: "↯", label: "Код или оформление" },
        { icon: "◇", label: "Выбор региона" },
        { icon: "◎", label: "Гарантия по формату" }
      ],
      details: [
        "Подарочная карта (код) или оформление подписки Xbox Game Pass.",
        "Подарочные карты подходят для любого региона. Для кодов не требуется передача аккаунта.",
        "Чтобы купить, получите код для самостоятельной активации или предоставьте данные аккаунта для безопасного оформления подписки."
      ],
      guarantee: "Гарантия на весь срок подписки / 24 часа на коды",
      regions: [
        {
          code: "TR",
          name: "Турция",
          currency: "TRY",
          prices: [
            {
              title: "Xbox Game Pass Ultimate",
              rows: [["3 месяца", "3500 ₽"]]
            }
          ]
        },
        {
          code: "US",
          name: "США",
          currency: "USD",
          prices: [
            {
              title: "Xbox Game Pass США",
              rows: [
                ["Essential · 1 месяц", "770 ₽"],
                ["Premium · 1 месяц", "1150 ₽"],
                ["Ultimate · 1 месяц", "1770 ₽"],
                ["Essential · 3 месяца", "1925 ₽"],
                ["Essential · 6 месяцев", "3060 ₽"],
                ["Premium · 3 месяца", "3360 ₽"],
                ["Ultimate · 3 месяца", "5310 ₽"],
                ["Essential · 12 месяцев", "5994 ₽"]
              ]
            }
          ]
        }
      ]
    },
    {
      slug: "telegram-premium",
      title: "Telegram Premium",
      category: "Подписки",
      filters: ["subs"],
      image: "assets/catalog/telegram-vstore-224x165.png",
      aliases: ["Телеграм", "Телега", "Тг премиум", "ТГ", "Telegram", "Premium"],
      items: ["Premium", "Gift", "Аккаунт"],
      priceFrom: "от 1100 ₽",
      description: "Telegram Premium для личного аккаунта или подарком. Менеджер уточнит удобный формат оформления.",
      accent: "#8b5cf6",
      accentRgb: "139, 92, 246",
      watermark: "TELEGRAM",
      benefits: [
        { icon: "✓", label: "Официальный Gift" },
        { icon: "↯", label: "Без входа в аккаунт" },
        { icon: "◇", label: "3, 6 или 12 месяцев" },
        { icon: "◎", label: "Гарантия на срок" }
      ],
      details: [
        "Подписка Telegram Premium на 3, 6 или 12 месяцев.",
        "Оформляется официально в виде подарка (Gift). Нет необходимости передавать данные для входа на аккаунт.",
        "Чтобы купить, оплатите заказ -> отправьте ваш юзернейм @username -> примите подарок в сообщениях от Telegram."
      ],
      guarantee: "Гарантия на весь срок подписки",
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
      image: "assets/catalog/apple-app-store-vstore-224x165.png",
      aliases: ["Апп стор", "Апстор", "Айтюнс", "Итюнс", "iTunes", "Apple", "Эпл", "подарочная карта"],
      items: ["Турция", "Россия", "США"],
      priceFrom: "от 23 ₽",
      description: "Подарочные карты App Store для нескольких регионов. Перед оплатой выберите страну вашего Apple ID.",
      accent: "#8b5cf6",
      accentRgb: "139, 92, 246",
      watermark: "APP STORE",
      benefits: [
        { icon: "✓", label: "Код пополнения" },
        { icon: "↯", label: "Несколько регионов" },
        { icon: "◇", label: "Без передачи аккаунта" },
        { icon: "◎", label: "24 часа гарантии" }
      ],
      details: [
        "Подарочная карта (код) пополнения баланса App Store (Apple ID).",
        "Код подходит только для выбранного региона Apple ID. Без передачи данных от вашего аккаунта.",
        "Чтобы купить, получите код -> зайдите в App Store -> нажмите «Погасить подарочную карту или код» -> активируйте."
      ],
      guarantee: "24-часовая гарантия",
      regions: [
        {
          code: "TR",
          name: "Турция",
          currency: "TRY",
          prices: [
            {
              title: "App Store & iTunes Турция",
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
          code: "RU",
          name: "Россия",
          currency: "RUB",
          prices: [
            {
              title: "App Store & iTunes Россия",
              rows: [
                ["500 RUB", "710 ₽"],
                ["600 RUB", "855 ₽"],
                ["700 RUB", "998 ₽"],
                ["800 RUB", "1137 ₽"],
                ["900 RUB", "1273 ₽"],
                ["1000 RUB", "1422 ₽"],
                ["1500 RUB", "2128 ₽"],
                ["2000 RUB", "2778 ₽"],
                ["3000 RUB", "4314 ₽"],
                ["4000 RUB", "5852 ₽"],
                ["5000 RUB", "7229 ₽"],
                ["6000 RUB", "8514 ₽"],
                ["7000 RUB", "9933 ₽"],
                ["9000 RUB", "11964 ₽"]
              ]
            }
          ]
        },
        {
          code: "US",
          name: "США",
          currency: "USD",
          prices: [
            {
              title: "App Store & iTunes США",
              rows: [
                ["10 USD", "806 ₽"],
                ["15 USD", "1213 ₽"],
                ["20 USD", "1612 ₽"],
                ["25 USD", "2021 ₽"],
                ["30 USD", "2425 ₽"],
                ["40 USD", "3242 ₽"],
                ["45 USD", "3433 ₽"],
                ["50 USD", "4022 ₽"],
                ["60 USD", "4841 ₽"],
                ["70 USD", "5675 ₽"],
                ["75 USD", "6080 ₽"],
                ["80 USD", "6486 ₽"],
                ["90 USD", "7297 ₽"],
                ["100 USD", "8038 ₽"],
                ["150 USD", "12161 ₽"],
                ["200 USD", "16214 ₽"],
                ["250 USD", "20268 ₽"],
                ["300 USD", "24321 ₽"],
                ["400 USD", "32430 ₽"],
                ["500 USD", "40537 ₽"]
              ]
            }
          ]
        }
      ]
    },
    {
      slug: "psn",
      title: "PSN",
      category: "Карты",
      filters: ["cards", "topup"],
      image: "assets/catalog/playstation-vstore-224x165.png",
      featuredImage: "assets/catalog/featured-playstation-desktop.jpg?v=20260727-3",
      featuredMobileImage: "assets/catalog/featured-playstation-mobile.jpg",
      featuredTitle: "PlayStation Gift Card",
      aliases: ["Плейстейшен", "Плейстешен", "Плейстэйшен", "ПСН", "ПС", "PlayStation", "PS", "PSN", "подарочная карта"],
      items: ["Турция", "Индия", "США"],
      priceFrom: "от 470 ₽",
      description: "Подарочные карты PlayStation для нескольких регионов. Перед оплатой проверьте страну вашего PSN-аккаунта.",
      accent: "#8b5cf6",
      accentRgb: "139, 92, 246",
      watermark: "PLAYSTATION",
      benefits: [
        { icon: "✓", label: "Пополнение PSN" },
        { icon: "↯", label: "Несколько регионов" },
        { icon: "◇", label: "Код без аккаунта" },
        { icon: "◎", label: "24 часа гарантии" }
      ],
      details: [
        "Подарочная карта (код) пополнения кошелька PlayStation Network.",
        "Код подходит только для выбранного региона PSN. Без передачи данных от вашего аккаунта.",
        "Чтобы купить, получите код -> зайдите в PS Store -> выберите пункт «Погашение кодов» -> введите и активируйте."
      ],
      guarantee: "24-часовая гарантия",
      regions: [
        {
          code: "TR",
          name: "Турция",
          currency: "TRY",
          prices: [
            {
              title: "PlayStation Турция",
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
          code: "IN",
          name: "Индия",
          currency: "INR",
          prices: [
            {
              title: "PlayStation Индия",
              rows: [
                ["1000 INR", "1001 ₽"],
                ["2000 INR", "2030 ₽"],
                ["3000 INR", "3129 ₽"],
                ["4000 INR", "4076 ₽"],
                ["5000 INR", "5096 ₽"]
              ]
            }
          ]
        },
        {
          code: "US",
          name: "США",
          currency: "USD",
          prices: [
            {
              title: "PlayStation США",
              rows: [
                ["50 USD", "3875 ₽"],
                ["75 USD", "5768 ₽"],
                ["100 USD", "7529 ₽"],
                ["150 USD", "11624 ₽"],
                ["200 USD", "15412 ₽"],
                ["250 USD", "19265 ₽"]
              ]
            }
          ]
        }
      ]
    },
    {
      slug: "steam",
      title: "Steam",
      category: "Карты",
      filters: ["cards", "topup"],
      image: "assets/catalog/steam-vstore-224x165.png",
      aliases: ["Стим", "Steam Wallet", "Стим гифт", "Стим кошелек", "ключи", "гифт"],
      items: ["Gift", "Wallet", "Keys"],
      priceFrom: "по запросу",
      description: "Steam Gift, пополнение кошелька и ключи. Менеджер уточнит регион и доступность позиции.",
      accent: "#8b5cf6",
      accentRgb: "139, 92, 246",
      watermark: "STEAM",
      benefits: [
        { icon: "✓", label: "Gift и Wallet" },
        { icon: "↯", label: "Проверка региона" },
        { icon: "◇", label: "Ключи по запросу" },
        { icon: "◎", label: "Гарантия по формату" }
      ],
      details: [
        "Steam Gift, пополнение кошелька и ключи для игр.",
        "Перед покупкой менеджер уточнит регион аккаунта и доступный способ выдачи.",
        "Чтобы купить, выберите позицию -> напишите в Telegram -> получите инструкцию по активации или выдаче."
      ],
      guarantee: "Гарантия зависит от формата товара",
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
