(function () {
  "use strict";

  var products = {
    "fortnite": {
      title: "Fortnite",
      category: "Игры",
      image: "assets/catalog/fort.jpg",
      items: ["Crew", "V-Bucks", "Battle Pass"],
      priceFrom: "от 299 ₽",
      description: "Раздел с популярными товарами Fortnite. Менеджер подскажет актуальные позиции, наличие и удобный способ выдачи.",
      options: [
        ["Fortnite Crew", "Подписка с бонусами и внутриигровыми преимуществами."],
        ["V-Bucks", "Пополнение баланса под нужный регион аккаунта."],
        ["Battle Pass", "Оформление сезонного пропуска после проверки данных."]
      ],
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
    "pubg-battlegrounds": {
      title: "PUBG Battlegrounds",
      category: "Игры",
      image: "assets/catalog/pubg-battlegrounds-16v1j.jpg",
      items: ["UC", "Prime", "Пополнение"],
      priceFrom: "от 90 ₽",
      description: "Пополнения и игровые товары PUBG с ручной проверкой перед выдачей.",
      options: [
        ["UC", "Пополнение внутриигровой валюты."],
        ["Prime", "Доступные подписочные позиции по запросу."],
        ["Пополнение", "Менеджер уточнит регион и способ выдачи."]
      ],
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
    "minecraft": {
      title: "Minecraft",
      category: "Игры",
      image: "assets/catalog/minecraft.jpg",
      items: ["Java", "Bedrock", "Minecoins"],
      priceFrom: "от 470 ₽",
      description: "Цифровые товары Minecraft: версии игры, внутриигровые покупки и подарочные варианты.",
      options: [
        ["Java", "Позиции для Minecraft Java Edition."],
        ["Bedrock", "Товары и активации для Bedrock Edition."],
        ["Minecoins", "Пополнение монет при наличии подходящего региона."]
      ],
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
    "discord": {
      title: "Discord",
      category: "Подписки",
      image: "assets/catalog/ds.png",
      items: ["Nitro", "Nitro Basic", "Gift"],
      priceFrom: "от 179 ₽",
      description: "Discord Nitro и подарочные варианты. Перед оформлением менеджер уточнит способ активации.",
      options: [
        ["Nitro", "Полная подписка Discord Nitro."],
        ["Nitro Basic", "Базовый вариант подписки."],
        ["Gift", "Подарочные варианты, если доступны."]
      ],
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
    "riot-games": {
      title: "Riot Games",
      category: "Игры",
      image: "assets/catalog/rout.jpg",
      items: ["RP", "VP", "Пополнение"],
      priceFrom: "от 250 ₽",
      description: "Пополнения для сервисов Riot Games. Доступность зависит от региона и текущих способов оплаты.",
      options: [
        ["RP", "Пополнение Riot Points."],
        ["VP", "Valorant Points по актуальному курсу."],
        ["Пополнение", "Подбор подходящего способа выдачи."]
      ],
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
    "battlefield-6": {
      title: "Battlefield 6",
      category: "Игры",
      image: "assets/catalog/battla.jpg",
      items: ["Edition", "Key", "Gift"],
      priceFrom: "от 790 ₽",
      description: "Раздел Battlefield с внутриигровой валютой, ключами, подарочными вариантами и доступными изданиями по запросу.",
      options: [
        ["BFC", "Пополнение Battlefield Currency."],
        ["Key", "Ключи при наличии."],
        ["Gift", "Подарочные варианты для подходящих регионов."]
      ],
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
    "valorant": {
      title: "Valorant",
      category: "Игры",
      image: "assets/catalog/valorant.jpg",
      items: ["Points", "Battle Pass", "Gift"],
      priceFrom: "от 350 ₽",
      description: "Valorant Points и другие позиции для аккаунта. Перед оплатой менеджер проверит регион.",
      options: [
        ["Points", "Пополнение Valorant Points."],
        ["Battle Pass", "Оформление боевого пропуска."],
        ["Gift", "Подарочные варианты при наличии."]
      ],
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
    "xbox-game-pass": {
      title: "Xbox Game Pass",
      category: "Подписки",
      image: "assets/catalog/xbox.png",
      items: ["Game Pass", "Ultimate", "Gift"],
      priceFrom: "от 3500 ₽",
      description: "Подписки Xbox Game Pass и подарочные варианты. Подходит для игровых аккаунтов с нужным регионом.",
      options: [
        ["Game Pass", "Основные варианты подписки."],
        ["Ultimate", "Расширенная подписка Game Pass Ultimate."],
        ["Gift", "Подарочные варианты, если доступны."]
      ],
      prices: [
        {
          title: "Xbox Game Pass Ultimate TR",
          rows: [
            ["3 Months", "3500 ₽"]
          ]
        }
      ]
    },
    "telegram-premium": {
      title: "Telegram Premium",
      category: "Подписки",
      image: "assets/catalog/telegram-premium.jpg",
      items: ["Premium", "Gift", "Аккаунт"],
      priceFrom: "от 1100 ₽",
      description: "Telegram Premium для личного аккаунта или подарком. Менеджер уточнит удобный формат оформления.",
      options: [
        ["Premium", "Оформление Telegram Premium."],
        ["Gift", "Подарочная подписка."],
        ["Аккаунт", "Проверка условий перед выдачей."]
      ],
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
    "app-store": {
      title: "App Store",
      category: "Карты",
      image: "assets/catalog/app-store.png",
      items: ["Gift Card", "Balance", "Region"],
      priceFrom: "от 23 ₽",
      description: "Подарочные карты App Store. Важно заранее выбрать правильный регион аккаунта.",
      options: [
        ["Gift Card", "Код подарочной карты."],
        ["Balance", "Пополнение баланса Apple ID."],
        ["Region", "Проверка региона перед покупкой."]
      ],
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
    "psn": {
      title: "PSN",
      category: "Карты",
      image: "assets/catalog/psn.jpg",
      items: ["Gift Card", "Plus", "Wallet"],
      priceFrom: "от 470 ₽",
      description: "Подарочные карты и позиции PlayStation. Регион аккаунта нужно проверить до оплаты.",
      options: [
        ["Gift Card", "Код для пополнения кошелька."],
        ["Plus", "Подписочные варианты PS Plus."],
        ["Wallet", "Пополнение кошелька PlayStation."]
      ],
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
    "steam": {
      title: "Steam",
      category: "Карты",
      image: "assets/catalog/steam.jpg",
      items: ["Gift", "Wallet", "Keys"],
      priceFrom: "по запросу",
      description: "Steam Gift, пополнение кошелька и ключи. Менеджер уточнит регион и доступность позиции.",
      options: [
        ["Gift", "Подарочные товары Steam."],
        ["Wallet", "Пополнение кошелька."],
        ["Keys", "Ключи при наличии."]
      ],
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
  };

  var params = new URLSearchParams(window.location.search);
  var slug = params.get("item") || "fortnite";
  var product = products[slug] || products.fortnite;
  var managerUrl = "https://t.me/MenagerVstore";
  var orderPanel = document.querySelector("[data-product-order-panel]");
  var orderImage = document.querySelector("[data-order-image]");
  var selectedPriceCard = null;

  function setText(selector, value) {
    Array.prototype.slice.call(document.querySelectorAll(selector)).forEach(function (node) {
      node.textContent = value;
    });
  }

  function createTag(label) {
    var tag = document.createElement("span");
    tag.className = "product-tag";
    tag.textContent = label;
    return tag;
  }

  function createPriceGroup(group) {
    var block = document.createElement("section");
    var title = document.createElement("h3");
    var list = document.createElement("div");

    block.className = "product-price-group";
    list.className = "product-price-list";
    title.textContent = group.title;
    block.appendChild(title);

    group.rows.forEach(function (row) {
      var item = document.createElement("button");
      var name = document.createElement("span");
      var price = document.createElement("strong");
      var arrow = document.createElement("i");

      item.className = "product-price-item";
      item.type = "button";
      name.textContent = row[0];
      price.textContent = row[1] + " ";
      arrow.className = "product-price-arrow";
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "→";
      price.appendChild(arrow);
      item.appendChild(name);
      item.appendChild(price);
      item.addEventListener("click", function () {
        selectPrice(item, row[0], row[1]);
      });
      list.appendChild(item);
    });

    block.appendChild(list);
    return block;
  }

  function buildTelegramLink(optionName, optionPrice) {
    var text = [
      "Здравствуйте!",
      "",
      "Хочу купить:",
      product.title,
      optionName,
      optionPrice
    ].join("\n");

    return managerUrl + "?text=" + encodeURIComponent(text);
  }

  function selectPrice(card, optionName, optionPrice) {
    if (selectedPriceCard) {
      selectedPriceCard.classList.remove("is-selected");
    }

    selectedPriceCard = card;
    card.classList.add("is-selected");

    if (orderPanel) {
      orderPanel.classList.remove("is-empty");
    }

    setText("[data-order-product]", product.title);
    setText("[data-order-name]", optionName);
    setText("[data-order-price]", optionPrice);
    if (orderImage) {
      orderImage.src = product.image;
      orderImage.alt = product.title;
    }

    var orderLink = document.querySelector("[data-order-link]");
    if (orderLink) {
      orderLink.href = buildTelegramLink(optionName, optionPrice);
    }
  }

  function clearSelection() {
    if (selectedPriceCard) {
      selectedPriceCard.classList.remove("is-selected");
      selectedPriceCard = null;
    }

    if (orderPanel) {
      orderPanel.classList.add("is-empty");
    }

    setText("[data-order-product]", product.title);
    setText("[data-order-name]", "Выберите позицию из прайса");
    setText("[data-order-price]", product.priceFrom || "—");

    var orderLink = document.querySelector("[data-order-link]");
    if (orderLink) {
      orderLink.href = buildTelegramLink("Позиция из каталога", product.priceFrom || "по запросу");
    }
  }

  setText("[data-product-title]", product.title);
  setText("[data-product-category]", product.category);
  setText("[data-product-description]", product.description);
  setText("[data-product-price]", product.priceFrom || "по запросу");

  var image = document.querySelector("[data-product-image]");
  if (image) {
    image.src = product.image;
    image.alt = product.title;
  }

  if (orderImage) {
    orderImage.src = product.image;
    orderImage.alt = product.title;
  }

  setText("[data-order-product]", product.title);
  setText("[data-order-name]", "Выберите позицию из прайса");
  setText("[data-order-price]", product.priceFrom || "—");

  var tags = document.querySelector("[data-product-tags]");
  if (tags) {
    product.items.forEach(function (item) {
      tags.appendChild(createTag(item));
    });
  }

  var prices = document.querySelector("[data-product-prices]");
  if (prices) {
    product.prices.forEach(function (group) {
      prices.appendChild(createPriceGroup(group));
    });
  }

  var order = document.querySelector("[data-product-order]");
  if (order) {
    order.href = buildTelegramLink("Позиция из каталога", product.priceFrom || "по запросу");
  }

  var clear = document.querySelector("[data-order-clear]");
  if (clear) {
    clear.addEventListener("click", clearSelection);
  }

  document.title = product.title + " — Vstore";
})();
