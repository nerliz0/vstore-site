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

  function gameKey(game) {
    return normalize((game && game.title) || "") + "::" + normalize((game && game.region) || "");
  }

  function normalizeEdition(game, edition, index) {
    var source = edition && typeof edition === "object" ? edition : {};
    var name = source.name || source.title || (index ? "Edition " + (index + 1) : "Standard Edition");
    var region = source.region || (game && game.region) || "Global";
    var priceValue = Number(source.priceValue || source.price_value);
    var priceLabel = source.priceLabel || source.price_label || "";

    if (!priceLabel && Number.isFinite(priceValue) && priceValue > 0) {
      priceLabel = formatPrice(priceValue);
    }

    return {
      id: source.id || normalize(name + " " + region),
      name: name,
      region: region,
      priceLabel: priceLabel || "Цена по запросу",
      priceValue: Number.isFinite(priceValue) ? priceValue : 0,
      note: source.note || source.description || ""
    };
  }

  function getGameEditions(game) {
    var editions = Array.isArray(game && game.editions) ? game.editions : [];

    if (!editions.length) {
      editions = [{
        name: "Standard Edition",
        region: game && game.region,
        priceLabel: game && game.priceLabel,
        priceValue: game && game.priceValue
      }, {
        name: "Другое издание / DLC",
        region: game && game.region,
        priceLabel: "Цена по запросу",
        priceValue: 0,
        note: "Уточним доступные издания и дополнения вручную"
      }];
    }

    return editions.map(function (edition, index) {
      return normalizeEdition(game, edition, index);
    }).filter(function (edition) {
      return edition.name || edition.region || edition.priceLabel;
    });
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
      cover: row.cover || "",
      editions: Array.isArray(row.editions) ? row.editions : []
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

  function buildTelegramLink(game, query, edition) {
    var config = window.VSTORE_CONFIG || {};
    var managerUrl = config.telegram || "https://t.me/MenagerVstore";
    var chosenEdition = edition || (game ? getGameEditions(game)[0] : null);
    var lines = [
      "Здравствуйте!",
      "",
      "Хочу Steam ключ:",
      game ? "Игра: " + game.title : "Игра: " + (query || "уточнить наличие"),
      chosenEdition && chosenEdition.name ? "Издание: " + chosenEdition.name : "",
      chosenEdition && chosenEdition.region ? "Регион: " + chosenEdition.region : "",
      chosenEdition && chosenEdition.priceLabel ? "Цена: " + chosenEdition.priceLabel : ""
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

  function createKeyCard(game, selectedGame, onSelect) {
    var card = document.createElement("article");
    var cover = document.createElement("div");
    var body = document.createElement("div");
    var title = document.createElement("h3");
    var meta = document.createElement("p");
    var region = document.createElement("span");
    var price = document.createElement("strong");
    var button = document.createElement("button");
    var editions = getGameEditions(game);
    var hasPrice = editions.some(function (edition) { return Boolean(edition.priceValue); });
    var selected = selectedGame && gameKey(selectedGame) === gameKey(game);

    card.className = "steam-key-card";
    if (selected) card.classList.add("is-selected");
    card.style.setProperty("--steam-key-accent", "139, 92, 246");
    cover.className = "steam-key-card__cover";
    if (game.cover) {
      cover.classList.add("has-cover");
      cover.style.backgroundImage = "linear-gradient(180deg, transparent, rgba(0,0,0,.42)), url('" + COVER_DIR + game.cover + "')";
    } else {
      cover.setAttribute("aria-label", game.title);
    }
    body.className = "steam-key-card__body";
    title.textContent = game.title;
    meta.textContent = "Steam ключ";
    region.textContent = editions.length > 1
      ? editions.length + " варианта"
      : editions[0].region || game.region || "Global";
    price.textContent = game.priceLabel || (editions[0] && editions[0].priceLabel) || "Цена по запросу";
    button.type = "button";
    button.textContent = hasPrice ? "Выбрать" : "Уточнить";

    card.tabIndex = 0;
    card.addEventListener("click", function (event) {
      if (event.target.closest("button")) return;
      onSelect(game);
    });
    card.addEventListener("keydown", function (event) {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      onSelect(game);
    });

    button.addEventListener("click", function () {
      onSelect(game);
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

  function createEditionButton(game, edition, index, selectedIndex, onChoose) {
    var button = document.createElement("button");
    var title = document.createElement("strong");
    var meta = document.createElement("span");
    var price = document.createElement("b");

    button.type = "button";
    button.className = "steam-key-edition";
    if (index === selectedIndex) button.classList.add("is-active");
    title.textContent = edition.name;
    meta.textContent = edition.region || "Global";
    price.textContent = edition.priceLabel || "Цена по запросу";
    button.appendChild(title);
    button.appendChild(meta);
    button.appendChild(price);
    button.addEventListener("click", function () { onChoose(index); });

    return button;
  }

  function renderPicker(picker, game, steamProduct, selectedEditionIndex, onChooseEdition, onClear) {
    picker.replaceChildren();

    if (!game) {
      picker.hidden = true;
      return;
    }

    var editions = getGameEditions(game);
    var activeIndex = Math.max(0, Math.min(selectedEditionIndex || 0, editions.length - 1));
    var activeEdition = editions[activeIndex] || editions[0];
    var hasPrice = Boolean(activeEdition && activeEdition.priceValue);
    var wrap = document.createElement("div");
    var info = document.createElement("div");
    var header = document.createElement("div");
    var title = document.createElement("h3");
    var subtitle = document.createElement("p");
    var clear = document.createElement("button");
    var regions = document.createElement("div");
    var options = document.createElement("div");
    var actions = document.createElement("div");
    var action = document.createElement("button");
    var regionList = Array.from(new Set(editions.map(function (edition) {
      return edition.region || "Global";
    }).filter(Boolean)));
    var activeRegion = (activeEdition && activeEdition.region) || "";

    picker.hidden = false;
    wrap.className = "steam-key-picker__inner";
    info.className = "steam-key-picker__info";
    header.className = "steam-key-picker__head";
    title.textContent = game.title;
    subtitle.textContent = editions.length > 1
      ? "Выберите издание и регион ключа"
      : "Проверьте вариант перед добавлением в корзину";
    clear.type = "button";
    clear.className = "steam-key-picker__clear";
    clear.textContent = "Отменить выбор";
    clear.addEventListener("click", onClear);
    regions.className = "steam-key-picker__regions";
    options.className = "steam-key-picker__options";
    actions.className = "steam-key-picker__actions";

    if (regionList.length > 1) {
      regionList.forEach(function (region) {
        var regionButton = document.createElement("button");
        regionButton.type = "button";
        regionButton.className = "steam-key-region";
        regionButton.textContent = region;
        regionButton.classList.toggle("is-active", region === activeRegion);
        regionButton.addEventListener("click", function () {
          var nextIndex = editions.findIndex(function (edition) {
            return (edition.region || "Global") === region;
          });
          if (nextIndex >= 0) onChooseEdition(nextIndex);
        });
        regions.appendChild(regionButton);
      });
    }

    editions.forEach(function (edition, index) {
      options.appendChild(createEditionButton(game, edition, index, activeIndex, onChooseEdition));
    });

    action.type = "button";
    action.className = "steam-key-picker__action";
    action.textContent = hasPrice ? "Добавить в корзину" : "Уточнить в Telegram";
    action.addEventListener("click", function () {
      if (!hasPrice || !window.VSTORE_CART) {
        window.open(buildTelegramLink(game, "", activeEdition), "_blank", "noopener,noreferrer");
        return;
      }

      var added = window.VSTORE_CART.add({
        slug: steamProduct.slug,
        title: steamProduct.title,
        image: steamProduct.image,
        regionCode: activeEdition.region || "",
        regionName: activeEdition.region || "",
        optionName: "Steam ключ: " + game.title + " — " + activeEdition.name,
        note: [
          "Игра: " + game.title,
          "Издание: " + activeEdition.name,
          "Регион ключа: " + (activeEdition.region || "Global"),
          activeEdition.note
        ].filter(Boolean).join(" · "),
        priceLabel: activeEdition.priceLabel || formatPrice(activeEdition.priceValue),
        priceValue: activeEdition.priceValue
      });

      if (added) {
        action.textContent = "Добавлено";
        window.setTimeout(function () {
          action.textContent = "Добавить в корзину";
        }, 1200);
      }
    });

    header.appendChild(title);
    header.appendChild(subtitle);
    info.appendChild(header);
    if (regionList.length > 1) info.appendChild(regions);
    info.appendChild(options);
    actions.appendChild(action);
    actions.appendChild(clear);
    info.appendChild(actions);
    wrap.appendChild(info);
    picker.appendChild(wrap);
  }

  function renderGames(list, games, selectedGame, onSelect, query) {
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
      list.appendChild(createKeyCard(game, selectedGame, onSelect));
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
        '<div class="steam-key-picker" data-steam-key-picker hidden></div>' +
        '<div class="steam-keys__subhead">Популярные игры</div>' +
        '<div class="steam-keys__grid" data-steam-keys-list></div>' +
      '</div>';

    var search = root.querySelector("[data-steam-keys-search]");
    var request = root.querySelector("[data-steam-keys-request]");
    var list = root.querySelector("[data-steam-keys-list]");
    var picker = root.querySelector("[data-steam-key-picker]");
    var activeTag = "";
    var selectedGame = null;
    var selectedEditionIndex = 0;

    function chooseEdition(index) {
      selectedEditionIndex = index;
      renderPicker(picker, selectedGame, steamProduct, selectedEditionIndex, chooseEdition, clearSelection);
    }

    function clearSelection() {
      selectedGame = null;
      selectedEditionIndex = 0;
      renderPicker(picker, null, steamProduct, selectedEditionIndex, chooseEdition, clearSelection);
      update();
    }

    function selectGame(game) {
      selectedGame = game;
      selectedEditionIndex = 0;
      renderPicker(picker, selectedGame, steamProduct, selectedEditionIndex, chooseEdition, clearSelection);
      update();
      if (picker && typeof picker.scrollIntoView === "function") {
        window.setTimeout(function () {
          picker.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 40);
      }
    }

    function update() {
      var query = search ? search.value : "";
      var games = gamesSourceList.filter(function (game) {
        return gameMatches(game, query, activeTag);
      });
      if (request) request.href = buildTelegramLink(null, query);
      renderGames(list, games, selectedGame, selectGame, query);
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
