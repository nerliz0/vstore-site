(function () {
  "use strict";

  var COVER_DIR = "assets/catalog/steam-keys/";
  var DEFAULT_TAGS = ["GTA", "RDR", "CS2", "EA", "Ubisoft", "Indie", "Новинки"];
  var DEFAULT_GAMES = [
    {
      title: "Red Dead Redemption 2",
      region: "RU/CIS",
      priceLabel: "от 1490 ₽",
      priceValue: 1490,
      tags: ["RDR", "Rockstar"],
      aliases: ["rdr", "rdr2", "red dead", "ред дед", "рдр", "рдр2"],
      cover: "",
      accent: "203, 73, 56"
    },
    {
      title: "GTA V",
      region: "Global",
      priceLabel: "от 990 ₽",
      priceValue: 990,
      tags: ["GTA", "Rockstar"],
      aliases: ["gta", "gta 5", "gta v", "гта", "гта 5"],
      cover: "",
      accent: "68, 147, 221"
    },
    {
      title: "Counter-Strike 2",
      region: "Global",
      priceLabel: "от 750 ₽",
      priceValue: 750,
      tags: ["CS2"],
      aliases: ["cs2", "counter strike", "кс", "кс2", "контра"],
      cover: "",
      accent: "236, 150, 55"
    },
    {
      title: "Elden Ring",
      region: "Global",
      priceLabel: "от 1990 ₽",
      priceValue: 1990,
      tags: ["Новинки"],
      aliases: ["elden", "elden ring", "элден", "елден"],
      cover: "",
      accent: "214, 174, 76"
    },
    {
      title: "Hogwarts Legacy",
      region: "Global",
      priceLabel: "от 1590 ₽",
      priceValue: 1590,
      tags: ["Новинки"],
      aliases: ["hogwarts", "хогвартс", "гарри поттер"],
      cover: "",
      accent: "155, 129, 203"
    },
    {
      title: "Cyberpunk 2077",
      region: "RU/CIS",
      priceLabel: "Цена по запросу",
      priceValue: 0,
      tags: ["Новинки"],
      aliases: ["cyberpunk", "cyber punk", "киберпанк"],
      cover: "",
      accent: "235, 210, 55"
    }
  ];

  window.VSTORE_DEFAULT_STEAM_KEYS = DEFAULT_GAMES;

  function normalize(value) {
    return String(value || "")
      .toLocaleLowerCase("ru-RU")
      .replace(/ё/g, "е")
      .replace(/[^\p{L}\p{N}]+/gu, " ")
      .trim();
  }

  function formatPrice(value) {
    return new Intl.NumberFormat("ru-RU").format(Math.round(value)) + " ₽";
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function getInitials(title) {
    return String(title || "Steam")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(function (part) { return part.charAt(0); })
      .join("")
      .toUpperCase();
  }

  function getSteamProduct() {
    var products = window.VSTORE_PRODUCTS || [];
    return products.find(function (product) {
      return product.slug === "steam";
    }) || {
      slug: "steam",
      title: "Steam",
      image: "assets/catalog/steam-vstore-224x165.png"
    };
  }

  function mapSteamKey(row) {
    return {
      id: row.id,
      title: row.title || "",
      region: row.region || "Global",
      priceLabel: row.price_label || "",
      priceValue: Number(row.price_value) || 0,
      tags: Array.isArray(row.tags) ? row.tags : [],
      aliases: Array.isArray(row.aliases) ? row.aliases : [],
      cover: row.cover || ""
    };
  }

  async function loadSteamGames() {
    if (
      !window.supabase ||
      !window.VSTORE_SUPABASE_URL ||
      !window.VSTORE_SUPABASE_ANON_KEY
    ) {
      return DEFAULT_GAMES;
    }

    try {
      var client = window.supabase.createClient(
        window.VSTORE_SUPABASE_URL,
        window.VSTORE_SUPABASE_ANON_KEY
      );
      var result = await client
        .from("steam_keys")
        .select("*")
        .eq("active", true)
        .order("sort_order", { ascending: true })
        .order("title", { ascending: true });

      if (result.error) throw result.error;
      return Array.isArray(result.data) && result.data.length
        ? result.data.map(mapSteamKey)
        : DEFAULT_GAMES;
    } catch (error) {
      console.warn("Vstore Steam keys fallback:", error);
      return DEFAULT_GAMES;
    }
  }

  function isSteamPage() {
    var params = new URLSearchParams(window.location.search);
    return (params.get("item") || "fortnite") === "steam";
  }

  function buildTelegramLink(game, query) {
    var config = window.VSTORE_CONFIG || {};
    var managerUrl = config.telegram || "https://t.me/MenagerVstore";
    var lines = [
      "Здравствуйте!",
      "",
      "Хочу Steam ключ:",
      game ? "Игра: " + game.title : "Игра: " + (query || "уточнить наличие"),
      game && game.region ? "Регион: " + game.region : "",
      game && game.priceLabel ? "Цена: " + game.priceLabel : ""
    ].filter(Boolean);

    return managerUrl.replace(/\/?$/, "") + "?text=" + encodeURIComponent(lines.join("\n"));
  }

  function gameMatches(game, query, activeTag) {
    var normalizedQuery = normalize(query);
    var normalizedTag = normalize(activeTag);
    var haystack = normalize([
      game.title,
      game.region,
      (game.tags || []).join(" "),
      (game.aliases || []).join(" ")
    ].join(" "));
    var tagMatch = !normalizedTag || (game.tags || []).some(function (tag) {
      return normalize(tag) === normalizedTag;
    }) || haystack.indexOf(normalizedTag) !== -1;
    var queryMatch = !normalizedQuery || haystack.indexOf(normalizedQuery) !== -1;

    return tagMatch && queryMatch;
  }

  function createKeyCard(game, steamProduct) {
    var card = document.createElement("article");
    var cover = document.createElement("div");
    var body = document.createElement("div");
    var title = document.createElement("h3");
    var meta = document.createElement("p");
    var region = document.createElement("span");
    var price = document.createElement("strong");
    var button = document.createElement("button");
    var hasPrice = Boolean(game.priceValue);

    card.className = "steam-key-card";
    card.style.setProperty("--steam-key-accent", "139, 92, 246");
    cover.className = "steam-key-card__cover";
    if (game.cover) {
      cover.style.backgroundImage = "linear-gradient(180deg, transparent, rgba(0,0,0,.42)), url('" + COVER_DIR + game.cover + "')";
    }
    cover.dataset.initials = getInitials(game.title);
    body.className = "steam-key-card__body";
    title.textContent = game.title;
    meta.textContent = "Steam ключ";
    region.textContent = game.region || "Global";
    price.textContent = game.priceLabel || "Цена по запросу";
    button.type = "button";
    button.textContent = hasPrice ? "Выбрать" : "Уточнить";

    button.addEventListener("click", function () {
      if (!hasPrice || !window.VSTORE_CART) {
        window.open(buildTelegramLink(game), "_blank", "noopener,noreferrer");
        return;
      }

      var added = window.VSTORE_CART.add({
        slug: steamProduct.slug,
        title: steamProduct.title,
        image: steamProduct.image,
        regionCode: game.region || "",
        regionName: game.region || "",
        optionName: "Steam ключ: " + game.title,
        note: "Регион ключа: " + (game.region || "Global"),
        priceLabel: game.priceLabel || formatPrice(game.priceValue),
        priceValue: game.priceValue
      });

      if (added) {
        button.textContent = "Добавлено";
        window.setTimeout(function () {
          button.textContent = "Выбрать";
        }, 1200);
      }
    });

    cover.setAttribute("aria-hidden", "true");
    body.appendChild(title);
    body.appendChild(meta);
    body.appendChild(region);
    body.appendChild(price);
    body.appendChild(button);
    card.appendChild(cover);
    card.appendChild(body);
    return card;
  }

  function renderGames(list, games, steamProduct, query) {
    list.replaceChildren();

    if (!games.length) {
      var empty = document.createElement("article");
      var button = document.createElement("a");
      empty.className = "steam-keys__empty";
      empty.innerHTML = '<strong>Не нашли игру?</strong><span>Отправим запрос менеджеру и проверим наличие вручную.</span>';
      button.href = buildTelegramLink(null, query);
      button.target = "_blank";
      button.rel = "noopener noreferrer";
      button.textContent = "Уточнить в Telegram";
      empty.appendChild(button);
      list.appendChild(empty);
      return;
    }

    games.forEach(function (game) {
      list.appendChild(createKeyCard(game, steamProduct));
    });
  }

  function createMarkup(root, steamProduct, gamesSource) {
    var gamesSourceList = Array.isArray(gamesSource) && gamesSource.length ? gamesSource : DEFAULT_GAMES;

    root.innerHTML = '' +
      '<div class="steam-keys__panel">' +
        '<div class="steam-keys__head">' +
          '<div>' +
            '<p class="section__eyebrow">Steam ключи</p>' +
            '<h2 id="steam-keys-title">Найдите игру или отправьте запрос</h2>' +
          '</div>' +
          '<a class="steam-keys__request" data-steam-keys-request href="' + escapeHtml(buildTelegramLink(null, "")) + '" target="_blank" rel="noopener noreferrer">Запросить игру →</a>' +
        '</div>' +
        '<label class="steam-keys__search">' +
          '<span aria-hidden="true">⌕</span>' +
          '<input data-steam-keys-search type="search" placeholder="Найти игру: GTA V, RDR 2, Elden Ring..." autocomplete="off" />' +
        '</label>' +
        '<div class="steam-keys__tags" aria-label="Быстрые фильтры">' +
          DEFAULT_TAGS.map(function (tag) {
            return '<button type="button" data-steam-keys-tag="' + escapeHtml(tag) + '">' + escapeHtml(tag) + '</button>';
          }).join("") +
        '</div>' +
        '<div class="steam-keys__subhead">Популярные игры</div>' +
        '<div class="steam-keys__grid" data-steam-keys-list></div>' +
      '</div>';

    var search = root.querySelector("[data-steam-keys-search]");
    var request = root.querySelector("[data-steam-keys-request]");
    var list = root.querySelector("[data-steam-keys-list]");
    var activeTag = "";

    function update() {
      var query = search ? search.value : "";
      var games = gamesSourceList.filter(function (game) {
        return gameMatches(game, query, activeTag);
      });
      if (request) request.href = buildTelegramLink(null, query);
      renderGames(list, games, steamProduct, query);
    }

    root.querySelectorAll("[data-steam-keys-tag]").forEach(function (button) {
      button.addEventListener("click", function () {
        var nextTag = button.dataset.steamKeysTag || "";
        activeTag = activeTag === nextTag ? "" : nextTag;
        root.querySelectorAll("[data-steam-keys-tag]").forEach(function (item) {
          item.classList.toggle("is-active", item.dataset.steamKeysTag === activeTag);
        });
        update();
      });
    });

    if (search) {
      search.addEventListener("input", update);
      search.addEventListener("keydown", function (event) {
        if (event.key !== "Enter") return;
        var games = gamesSourceList.filter(function (game) {
          return gameMatches(game, search.value, activeTag);
        });
        if (!games.length) {
          window.open(buildTelegramLink(null, search.value), "_blank", "noopener,noreferrer");
        }
      });
    }

    update();
  }

  async function init() {
    var root = document.querySelector("[data-steam-keys]");
    if (!root || !isSteamPage()) return;

    document.body.classList.add("has-steam-keys");
    root.hidden = false;
    createMarkup(root, getSteamProduct(), await loadSteamGames());
  }

  Promise.resolve(window.VSTORE_PRODUCTS_READY || window.VSTORE_PRODUCTS)
    .then(init)
    .catch(init);
})();
