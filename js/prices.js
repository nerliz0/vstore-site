/**

 * Vstore — прайс-лист

 *

 * brand  — строка в preview (Fortnite, Discord…)

 * title  — название тарифа (Crew, Nitro Basic…)

 * name   — полное имя для Telegram-заказа

 */

const VOLTIX_PRICES = {
  /** Акценты и обложки для карточек категорий (brand → meta) */
  brandMeta: {
    Fortnite: {
      image: "assets/catalog/crew.png",
      gradient:
        "linear-gradient(145deg, #2d1b69 0%, #1a1035 55%, #0f0a1a 100%)",
    },
    Discord: {
      image: "assets/catalog/dslogo.png",
      gradient:
        "linear-gradient(145deg, #5865f2 0%, #404eed 45%, #2f3136 100%)",
    },
    ChatGPT: {
      image: "assets/catalog/chatgpt-logo-free.png",
      gradient:
        "linear-gradient(145deg, #10a37f 0%, #0d8a6a 45%, #0a1a14 100%)",
    },
  },

  groups: [
    {
      id: "gaming",

      name: "Gaming Services",

      tagline: "Epic Games · Steam · Xbox · PlayStation",

      description: "Игровые подписки и валюты",

      defaultMethod: "Telegram",

      defaultGuarantee: "Замена",

      products: [
        {
          brand: "Fortnite",

          title: "Crew",

          name: "Fortnite Crew",

          price: "299 ₽",

          note: "1 месяц",

          delivery: "5–15 мин",

          image: "assets/catalog/crew.png",
        },
        {
          brand: "Fortnite",
          title: "800 V-Bucks",
          name: "Fortnite 800 V-Bucks",
          price: "429 ₽",
          label: "Валюта",
          note: "800 V-Bucks",
          delivery: "5–15 мин",
          image: "assets/catalog/vbucks800.png",
        },

        {
          brand: "Fortnite",
          title: "2400 V-Bucks",
          name: "Fortnite 2400 V-Bucks",
          price: "969 ₽",
          label: "Валюта",
          note: "2400 V-Bucks",
          delivery: "5–15 мин",
          image: "assets/catalog/vbucks2400.png",
        },

        {
          brand: "Fortnite",
          title: "4500 V-Bucks",
          name: "Fortnite 4500 V-Bucks",
          price: "1499 ₽",
          label: "Валюта",
          note: "4500 V-Bucks",
          delivery: "5–15 мин",
          image: "assets/catalog/vbucks4500.png",
        },

        {
          brand: "Fortnite",
          title: "12500 V-Bucks",
          name: "Fortnite 12500 V-Bucks",
          price: "3499 ₽",
          label: "Валюта",
          note: "12500 V-Bucks",
          delivery: "5–15 мин",
          image: "assets/catalog/vbucks12500.png",
        },
      ],
    },

    {
      id: "subscriptions",

      name: "Subscriptions",

      tagline: "Discord · ChatGPT · Spotify · и другие",

      description: "Подписки на сервисы",

      defaultMethod: "Telegram",

      defaultGuarantee: "Замена",

      products: [
        {
          brand: "Discord",
          title: "Nitro Basic",
          name: "Discord Nitro Basic",
          price: "179 ₽",
          note: "1 месяц",
          delivery: "5–15 мин",
          image: "assets/catalog/dslogo.png",
        },

        {
          brand: "Discord",
          title: "Nitro Basic",
          name: "Discord Nitro Basic",
          price: "1249 ₽",
          note: "12 месяцев",
          delivery: "5–15 мин",
          image: "assets/catalog/dslogo.png",
        },

        {
          brand: "Discord",
          title: "Nitro Full",
          name: "Discord Nitro Full",
          price: "349 ₽",
          note: "1 месяц",
          delivery: "5–15 минут",
          image: "assets/catalog/dsfulllogo.png",
        },

        {
          brand: "Discord",
          title: "Nitro Full",
          name: "Discord Nitro Full",
          price: "2849 ₽",
          note: "12 месяцев",
          delivery: "5–15 мин",
          image: "assets/catalog/dsfulllogo.png",
        },

        {
          brand: "ChatGPT",
          title: "Plus",
          name: "ChatGPT Plus",
          price: "2099 ₽",
          note: "1 месяц",
          delivery: "до 30 минут",
          image: "assets/catalog/chatgpt-logo-free.png",
        },

        {
          brand: "ChatGPT",
          title: "Go",
          name: "ChatGPT Go",
          price: "649 ₽",
          note: "1 месяц",
          delivery: "до 30 минут",
          image: "assets/catalog/chatgpt-logo-free.png",
        },
      ],
    },
  ],
};

