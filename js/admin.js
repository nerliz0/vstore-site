(function () {
  "use strict";

  var loginView = document.querySelector("[data-login-view]");
  var adminView = document.querySelector("[data-admin-view]");
  var loginForm = document.querySelector("[data-login-form]");
  var loginStatus = document.querySelector("[data-login-status]");
  var list = document.querySelector("[data-products-list]");
  var count = document.querySelector("[data-products-count]");
  var form = document.querySelector("[data-product-form]");
  var editorTitle = document.querySelector("[data-editor-title]");
  var saveStatus = document.querySelector("[data-save-status]");
  var benefitsList = document.querySelector("[data-benefits-list]");
  var detailsList = document.querySelector("[data-details-list]");
  var pricesList = document.querySelector("[data-prices-list]");
  var regionsList = document.querySelector("[data-regions-list]");
  var productsPanel = document.querySelector("[data-products-panel]");
  var steamPanel = document.querySelector("[data-steam-panel]");
  var steamList = document.querySelector("[data-steam-list]");
  var steamCount = document.querySelector("[data-steam-count]");
  var steamForm = document.querySelector("[data-steam-form]");
  var steamEditorTitle = document.querySelector("[data-steam-editor-title]");
  var steamStatus = document.querySelector("[data-steam-status]");
  var steamEditionsList = document.querySelector("[data-steam-editions-list]");
  var steamSearchInput = document.querySelector("[data-steam-search]");
  var currentProduct = null;
  var currentSteamKey = null;
  var products = [];
  var steamKeys = [];
  var slugTouched = false;
  var collapseStorageKey = "vstore-admin-collapsed-cards";
  var defaultSteamKeys = [
    {
      platform: "steam",
      title: "ARC Raiders",
      region: "global",
      priceLabel: "от 2300 ₽",
      priceValue: 2300,
      tags: ["Новинки"],
      aliases: ["arc", "arc raiders", "арк", "арк рейдерс"],
      cover: "arc-raiders.jpg",
      sortOrder: 5,
      active: true
    },
    {
      platform: "steam",
      title: "Marvel's Spider-Man Remastered",
      region: "RU/CIS",
      priceLabel: "от 1490 ₽",
      priceValue: 1490,
      tags: ["Marvel"],
      aliases: ["marvel", "spider man", "spiderman", "spider-man", "паук", "человек паук"],
      cover: "marvel.jpg",
      sortOrder: 10,
      active: true
    },
    {
      platform: "steam",
      title: "DARK SOULS II: Scholar of the First Sin",
      region: "Global",
      priceLabel: "от 1469 ₽",
      priceValue: 1469,
      tags: ["Dark Souls"],
      aliases: ["dark souls 2", "dark souls ii", "ds2", "дарк соулс 2"],
      cover: "dark-souls2 scholar.jpg",
      sortOrder: 20,
      active: true
    },
    {
      platform: "steam",
      title: "DARK SOULS: REMASTERED",
      region: "Global",
      priceLabel: "от 2100 ₽",
      priceValue: 2100,
      tags: ["Dark Souls"],
      aliases: ["dark souls", "dark souls remastered", "ds1", "дарк соулс"],
      cover: "dark souls re.jpg",
      sortOrder: 30,
      active: true
    },
    {
      platform: "steam",
      title: "Red Dead Redemption 2",
      region: "RU/CIS",
      priceLabel: "от 1490 ₽",
      priceValue: 1490,
      tags: ["RDR", "Rockstar"],
      aliases: ["rdr", "rdr2", "red dead", "ред дед", "рдр", "рдр2"],
      cover: "",
      sortOrder: 40,
      active: true
    },
    {
      platform: "steam",
      title: "GTA V",
      region: "Global",
      priceLabel: "от 990 ₽",
      priceValue: 990,
      tags: ["GTA", "Rockstar"],
      aliases: ["gta", "gta 5", "gta v", "гта", "гта 5"],
      cover: "",
      sortOrder: 50,
      active: true
    },
    {
      platform: "steam",
      title: "Counter-Strike 2",
      region: "Global",
      priceLabel: "от 750 ₽",
      priceValue: 750,
      tags: ["CS2"],
      aliases: ["cs2", "counter strike", "кс", "кс2", "контра"],
      cover: "",
      sortOrder: 60,
      active: true
    },
    {
      platform: "steam",
      title: "Elden Ring",
      region: "Global",
      priceLabel: "от 1990 ₽",
      priceValue: 1990,
      tags: ["Новинки"],
      aliases: ["elden", "elden ring", "элден", "елден"],
      cover: "elden.jpg",
      sortOrder: 70,
      active: true
    },
    {
      platform: "steam",
      title: "Hogwarts Legacy",
      region: "Global",
      priceLabel: "от 1590 ₽",
      priceValue: 1590,
      tags: ["Новинки"],
      aliases: ["hogwarts", "хогвартс", "гарри поттер"],
      cover: "",
      sortOrder: 80,
      active: true
    },
    {
      platform: "steam",
      title: "Cyberpunk 2077",
      region: "RU/CIS",
      priceLabel: "Цена по запросу",
      priceValue: 0,
      tags: ["Новинки"],
      aliases: ["cyberpunk", "cyber punk", "киберпанк"],
      cover: "",
      sortOrder: 90,
      active: true
    }
  ];

  if (!window.supabase || !window.VSTORE_SUPABASE_URL || !window.VSTORE_SUPABASE_ANON_KEY) {
    if (loginStatus) loginStatus.textContent = "Supabase не подключен. Проверь js/supabase-config.js.";
    return;
  }

  var client = window.supabase.createClient(
    window.VSTORE_SUPABASE_URL,
    window.VSTORE_SUPABASE_ANON_KEY
  );

  function setStatus(node, text) {
    if (node) node.textContent = text || "";
  }

  function toList(value) {
    return String(value || "")
      .split(",")
      .map(function (item) { return item.trim(); })
      .filter(Boolean);
  }

  function fromList(value) {
    return Array.isArray(value) ? value.join(", ") : "";
  }

  function asArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function firstValue() {
    for (var index = 0; index < arguments.length; index += 1) {
      if (arguments[index] !== undefined && arguments[index] !== null && arguments[index] !== "") {
        return arguments[index];
      }
    }
    return "";
  }

  function normalizeSteamEditions(item) {
    var editions = asArray(item && item.editions).map(function (edition, index) {
      var priceValue = firstValue(edition.priceValue, edition.price_value, item.priceValue, item.price_value, 0);

      return {
        name: edition.name || edition.title || (index ? "Edition " + (index + 1) : "Standard Edition"),
        region: edition.region || item.region || "Global",
        priceLabel: edition.priceLabel || edition.price_label || item.priceLabel || item.price_label || "",
        priceValue: Number(priceValue) || 0,
        note: edition.note || edition.description || ""
      };
    }).filter(function (edition) {
      return edition.name || edition.region || edition.priceLabel || edition.priceValue || edition.note;
    });

    if (!editions.length && item) {
      editions.push({
        name: "Standard Edition",
        region: item.region || "Global",
        priceLabel: item.priceLabel || item.price_label || "",
        priceValue: Number(item.priceValue || item.price_value) || 0,
        note: ""
      });
    }

    return editions;
  }

  function makeSlug(value) {
    var map = {
      а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
      и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
      с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch",
      ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya"
    };

    return String(value || "")
      .toLowerCase()
      .split("")
      .map(function (char) { return map[char] !== undefined ? map[char] : char; })
      .join("")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .replace(/-{2,}/g, "-") || "new-product";
  }

  function productToRow(product) {
    return {
      slug: product.slug,
      title: product.title,
      category: product.category || "",
      filters: product.filters || [],
      image: product.image || "",
      featured_image: product.featuredImage || product.featured_image || "",
      featured_mobile_image: product.featuredMobileImage || product.featured_mobile_image || "",
      featured_title: product.featuredTitle || product.featured_title || product.title,
      aliases: product.aliases || [],
      items: product.items || [],
      price_from: product.priceFrom || product.price_from || "",
      description: product.description || "",
      accent: product.accent || "#8b5cf6",
      accent_rgb: product.accentRgb || product.accent_rgb || "139, 92, 246",
      watermark: product.watermark || product.title || "",
      benefits: product.benefits || [],
      details: product.details || [],
      guarantee: product.guarantee || "",
      prices: product.prices || [],
      regions: product.regions || [],
      active: product.active !== false,
      sort_order: Number.isFinite(Number(product.sortOrder || product.sort_order))
        ? Number(product.sortOrder || product.sort_order)
        : 100
    };
  }

  function rowToProduct(row) {
    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      category: row.category || "",
      filters: row.filters || [],
      image: row.image || "",
      featuredImage: row.featured_image || "",
      featuredMobileImage: row.featured_mobile_image || "",
      featuredTitle: row.featured_title || "",
      aliases: row.aliases || [],
      items: row.items || [],
      priceFrom: row.price_from || "",
      description: row.description || "",
      accent: row.accent || "#8b5cf6",
      accentRgb: row.accent_rgb || "139, 92, 246",
      watermark: row.watermark || "",
      benefits: row.benefits || [],
      details: row.details || [],
      guarantee: row.guarantee || "",
      prices: row.prices || [],
      regions: row.regions || [],
      active: row.active !== false,
      sortOrder: row.sort_order || 100
    };
  }

  function steamKeyToRow(item) {
    return {
      platform: item.platform || "steam",
      title: item.title || "",
      region: item.region || "Global",
      price_label: item.priceLabel || item.price_label || "",
      price_value: Number(item.priceValue || item.price_value) || 0,
      tags: item.tags || [],
      aliases: item.aliases || [],
      cover: item.cover || "",
      editions: normalizeSteamEditions(item),
      active: item.active !== false,
      sort_order: Number.isFinite(Number(item.sortOrder || item.sort_order))
        ? Number(item.sortOrder || item.sort_order)
        : 100
    };
  }

  function rowToSteamKey(row) {
    return {
      id: row.id,
      platform: row.platform || "steam",
      title: row.title || "",
      region: row.region || "Global",
      priceLabel: row.price_label || "",
      priceValue: Number(row.price_value) || 0,
      tags: row.tags || [],
      aliases: row.aliases || [],
      cover: row.cover || "",
      editions: normalizeSteamEditions(row),
      active: row.active !== false,
      sortOrder: row.sort_order || 100
    };
  }

  function createEmptySteamKey() {
    return {
      platform: "steam",
      title: "Новый ключ",
      region: "Global",
      priceLabel: "по запросу",
      priceValue: 0,
      tags: [],
      aliases: [],
      cover: "",
      editions: [{ name: "Standard Edition", region: "Global", priceLabel: "по запросу", priceValue: 0, note: "" }],
      active: true,
      sortOrder: 100
    };
  }

  function showAdmin() {
    if (loginView) loginView.hidden = true;
    if (adminView) adminView.hidden = false;
  }

  function showLogin() {
    if (loginView) loginView.hidden = false;
    if (adminView) adminView.hidden = true;
  }

  function createEmptyProduct() {
    return {
      slug: "new-product",
      title: "Новый товар",
      category: "Игры",
      filters: ["games"],
      image: "assets/catalog/fortnite-vstore.png",
      featuredImage: "",
      featuredMobileImage: "",
      featuredTitle: "",
      aliases: [],
      items: [],
      priceFrom: "по запросу",
      description: "",
      accent: "#8b5cf6",
      accentRgb: "139, 92, 246",
      watermark: "VSTORE",
      benefits: [
        { icon: "✓", label: "Ручная выдача" },
        { icon: "↯", label: "Ответ 5-15 минут" }
      ],
      details: ["Коротко опишите, что получает покупатель."],
      guarantee: "",
      prices: [{ title: "Основные позиции", rows: [["Позиция", "по запросу"]] }],
      regions: [],
      active: true,
      sortOrder: 100
    };
  }

  function createElement(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function getCollapsedCards() {
    try {
      return JSON.parse(localStorage.getItem(collapseStorageKey) || "{}");
    } catch (error) {
      return {};
    }
  }

  function saveCollapsedCards(state) {
    try {
      localStorage.setItem(collapseStorageKey, JSON.stringify(state));
    } catch (error) {
      // LocalStorage can be disabled in private browsers; collapsing should still work.
    }
  }

  function makeCollapseKey(card, index) {
    var panel = card.closest("[data-steam-panel]") ? "keys" : "products";
    var heading = card.querySelector(":scope > .admin-card__head h2");
    var text = heading ? heading.textContent : "section-" + index;
    return panel + "-" + text.toLowerCase().replace(/[^a-zа-я0-9]+/gi, "-");
  }

  function getCardTools(head) {
    var tools = head.querySelector(":scope > .admin-builder-tools");
    if (tools) return tools;

    tools = createElement("div", "admin-builder-tools");
    Array.from(head.children).forEach(function (child) {
      if (child.tagName === "BUTTON") tools.appendChild(child);
    });
    head.appendChild(tools);
    return tools;
  }

  function initCollapsibleCards() {
    var state = getCollapsedCards();
    document.querySelectorAll(".admin-editor-main > .admin-card").forEach(function (card, index) {
      var head = card.querySelector(":scope > .admin-card__head");
      if (!head || card.dataset.collapseReady === "true") return;

      var key = card.dataset.collapseKey || makeCollapseKey(card, index);
      var tools = getCardTools(head);
      var toggle = createElement("button", "admin-mini-button admin-collapse-toggle", "Свернуть");
      toggle.type = "button";
      toggle.setAttribute("aria-expanded", "true");
      tools.appendChild(toggle);

      function setCollapsed(collapsed, persist) {
        card.classList.toggle("is-collapsed", collapsed);
        toggle.textContent = collapsed ? "Развернуть" : "Свернуть";
        toggle.setAttribute("aria-expanded", String(!collapsed));
        if (persist) {
          state[key] = collapsed;
          saveCollapsedCards(state);
        }
      }

      setCollapsed(Boolean(state[key]), false);
      toggle.addEventListener("click", function () {
        setCollapsed(!card.classList.contains("is-collapsed"), true);
      });
      card.dataset.collapseReady = "true";
    });
  }

  function createInput(label, value, placeholder, datasetName) {
    var wrapper = createElement("label");
    var caption = createElement("span", null, label);
    var input = document.createElement("input");
    input.value = value || "";
    input.placeholder = placeholder || "";
    if (datasetName) input.dataset[datasetName] = "";
    wrapper.appendChild(caption);
    wrapper.appendChild(input);
    return wrapper;
  }

  function createTextarea(label, value, placeholder, datasetName) {
    var wrapper = createElement("label");
    var caption = createElement("span", null, label);
    var input = document.createElement("textarea");
    input.rows = 3;
    input.value = value || "";
    input.placeholder = placeholder || "";
    if (datasetName) input.dataset[datasetName] = "";
    wrapper.appendChild(caption);
    wrapper.appendChild(input);
    return wrapper;
  }

  function createRemoveButton(label) {
    var button = createElement("button", "admin-icon-button", label || "Удалить");
    button.type = "button";
    button.addEventListener("click", function () {
      var card = button.closest("[data-builder-card]");
      if (card) card.remove();
      updatePreview();
    });
    return button;
  }

  function appendBenefit(benefit) {
    var item = createElement("article", "admin-builder-row");
    item.dataset.builderCard = "";
    item.dataset.benefitItem = "";
    item.appendChild(createInput("Иконка", benefit && benefit.icon, "✓", "benefitIcon"));
    item.appendChild(createInput("Текст", benefit && benefit.label || benefit, "Официальное оформление", "benefitLabel"));
    item.appendChild(createRemoveButton("×"));
    benefitsList.appendChild(item);
  }

  function appendDetail(text) {
    var item = createElement("article", "admin-builder-row admin-builder-row--wide");
    item.dataset.builderCard = "";
    item.dataset.detailItem = "";
    item.appendChild(createTextarea("Пункт", text, "Опишите шаг, гарантию или условие", "detailText"));
    item.appendChild(createRemoveButton("×"));
    detailsList.appendChild(item);
  }

  function appendPriceRow(container, row) {
    var details = row && row[2];
    var detailsValue = "";

    if (typeof details === "string") {
      detailsValue = details;
    } else if (Array.isArray(details)) {
      detailsValue = details.join("\n");
    } else if (details && typeof details === "object") {
      detailsValue = [
        details.summary,
        details.need ? "Нужно: " + details.need : "",
        details.guarantee ? "Гарантия: " + details.guarantee : "",
        asArray(details.bullets).length ? "Плюсы: " + asArray(details.bullets).join(", ") : ""
      ].filter(Boolean).join("\n");
    }

    var item = createElement("article", "admin-price-row");
    item.dataset.builderCard = "";
    item.dataset.priceRow = "";
    item.appendChild(createInput("Позиция", row && row[0], "1000 UC", "priceName"));
    item.appendChild(createInput("Цена", row && row[1], "990 ₽", "priceValue"));
    item.appendChild(createTextarea("Мини-описание", detailsValue, "Заглушка: что получает покупатель, что нужно от него, гарантия", "priceDetails"));
    item.appendChild(createRemoveButton("×"));
    container.appendChild(item);
  }

  function appendPriceGroup(group, parent) {
    var target = parent || pricesList;
    var card = createElement("section", "admin-builder-card");
    var head = createElement("div", "admin-builder-card__head");
    var titleLabel = createInput("Название группы", group && group.title, "Основные позиции", "groupTitle");
    var addRow = createElement("button", "admin-mini-button", "Добавить строку");
    var rows = createElement("div", "admin-stack");

    card.dataset.builderCard = "";
    card.dataset.priceGroup = "";
    rows.dataset.priceRows = "";
    addRow.type = "button";
    addRow.addEventListener("click", function () {
      appendPriceRow(rows, ["", ""]);
    });

    head.appendChild(titleLabel);
    head.appendChild(addRow);
    head.appendChild(createRemoveButton("Удалить группу"));
    card.appendChild(head);
    card.appendChild(rows);
    asArray(group && group.rows).forEach(function (row) { appendPriceRow(rows, row); });
    if (!asArray(group && group.rows).length) appendPriceRow(rows, ["", ""]);
    target.appendChild(card);
  }

  function appendRegion(region) {
    var card = createElement("section", "admin-builder-card admin-region-card");
    var head = createElement("div", "admin-region-grid");
    var groups = createElement("div", "admin-stack");
    var tools = createElement("div", "admin-builder-tools");
    var addGroup = createElement("button", "admin-mini-button", "Добавить группу прайса");

    card.dataset.builderCard = "";
    card.dataset.region = "";
    groups.dataset.regionPriceGroups = "";
    addGroup.type = "button";
    addGroup.addEventListener("click", function () {
      appendPriceGroup({ title: "Прайс", rows: [["", ""]] }, groups);
    });

    head.appendChild(createInput("Код", region && region.code, "TR", "regionCode"));
    head.appendChild(createInput("Название", region && region.name, "Турция", "regionName"));
    head.appendChild(createInput("Валюта", region && region.currency, "TRY", "regionCurrency"));
    tools.appendChild(addGroup);
    tools.appendChild(createRemoveButton("Удалить регион"));
    card.appendChild(head);
    card.appendChild(tools);
    card.appendChild(groups);
    asArray(region && region.prices).forEach(function (group) { appendPriceGroup(group, groups); });
    if (!asArray(region && region.prices).length) {
      appendPriceGroup({ title: "Прайс", rows: [["", ""]] }, groups);
    }
    regionsList.appendChild(card);
  }

  function appendSteamEdition(edition) {
    if (!steamEditionsList) return;

    var item = createElement("article", "admin-price-row admin-steam-edition-row");
    item.dataset.builderCard = "";
    item.dataset.steamEdition = "";
    item.appendChild(createInput("Издание", edition && edition.name, "Standard Edition", "steamEditionName"));
    item.appendChild(createInput("Регион", edition && edition.region, "Global", "steamEditionRegion"));
    item.appendChild(createInput("Цена текстом", edition && edition.priceLabel, "от 1490 ₽", "steamEditionPriceLabel"));
    item.appendChild(createInput("Цена числом", edition && edition.priceValue, "1490", "steamEditionPriceValue"));
    item.appendChild(createTextarea("Пометка", edition && edition.note, "Например: ключ RU/CIS, Deluxe, DLC included", "steamEditionNote"));
    item.appendChild(createRemoveButton("×"));
    steamEditionsList.appendChild(item);
  }

  function readBenefits() {
    return Array.prototype.slice.call(benefitsList.querySelectorAll("[data-benefit-item]"))
      .map(function (item) {
        return {
          icon: item.querySelector("[data-benefit-icon]").value.trim() || "✓",
          label: item.querySelector("[data-benefit-label]").value.trim()
        };
      })
      .filter(function (item) { return item.label; });
  }

  function readDetails() {
    return Array.prototype.slice.call(detailsList.querySelectorAll("[data-detail-item]"))
      .map(function (item) { return item.querySelector("[data-detail-text]").value.trim(); })
      .filter(Boolean);
  }

  function readPriceGroups(container) {
    return Array.prototype.slice.call(container.querySelectorAll(":scope > [data-price-group]"))
      .map(function (group) {
        var title = group.querySelector("[data-group-title]").value.trim() || "Прайс";
        var rows = Array.prototype.slice.call(group.querySelectorAll(":scope [data-price-row]"))
          .map(function (row) {
            var priceRow = [
              row.querySelector("[data-price-name]").value.trim(),
              row.querySelector("[data-price-value]").value.trim()
            ];
            var details = row.querySelector("[data-price-details]").value.trim();
            if (details) {
              priceRow.push({ summary: details });
            }
            return priceRow;
          })
          .filter(function (row) { return row[0] || row[1]; });
        return { title: title, rows: rows };
      })
      .filter(function (group) { return group.rows.length; });
  }

  function readRegions() {
    return Array.prototype.slice.call(regionsList.querySelectorAll(":scope > [data-region]"))
      .map(function (region) {
        return {
          code: region.querySelector("[data-region-code]").value.trim(),
          name: region.querySelector("[data-region-name]").value.trim(),
          currency: region.querySelector("[data-region-currency]").value.trim(),
          prices: readPriceGroups(region.querySelector("[data-region-price-groups]"))
        };
      })
      .filter(function (region) {
        return region.code || region.name || region.prices.length;
      });
  }

  function readSteamEditions() {
    if (!steamEditionsList) return [];

    return Array.prototype.slice.call(steamEditionsList.querySelectorAll("[data-steam-edition]"))
      .map(function (item) {
        return {
          name: item.querySelector("[data-steam-edition-name]").value.trim(),
          region: item.querySelector("[data-steam-edition-region]").value.trim() || "Global",
          priceLabel: item.querySelector("[data-steam-edition-price-label]").value.trim(),
          priceValue: Number(item.querySelector("[data-steam-edition-price-value]").value) || 0,
          note: item.querySelector("[data-steam-edition-note]").value.trim()
        };
      })
      .filter(function (edition) {
        return edition.name || edition.region || edition.priceLabel || edition.priceValue || edition.note;
      });
  }

  function renderList() {
    if (!list) return;
    list.replaceChildren();
    if (count) count.textContent = String(products.length);

    products.forEach(function (product) {
      var button = document.createElement("button");
      var title = createElement("strong", null, product.title);
      var meta = createElement("span", null, product.slug + " · " + (product.active ? "активен" : "скрыт"));

      button.className = "admin-product";
      button.type = "button";
      if (currentProduct && currentProduct.slug === product.slug) button.classList.add("is-active");
      button.appendChild(title);
      button.appendChild(meta);
      button.addEventListener("click", function () { fillForm(product); });
      list.appendChild(button);
    });
  }

  function renderSteamList() {
    if (!steamList) return;
    steamList.replaceChildren();
    var query = steamSearchInput ? steamSearchInput.value.trim().toLowerCase() : "";
    var visibleKeys = steamKeys.filter(function (item) {
      if (!query) return true;
      return [
        item.title,
        item.region,
        item.priceLabel,
        asArray(item.tags).join(" "),
        asArray(item.aliases).join(" "),
        normalizeSteamEditions(item).map(function (edition) {
          return [edition.name, edition.region, edition.priceLabel, edition.note].join(" ");
        }).join(" ")
      ].join(" ").toLowerCase().indexOf(query) !== -1;
    });

    if (steamCount) steamCount.textContent = query ? String(visibleKeys.length) + "/" + steamKeys.length : String(steamKeys.length);

    if (!visibleKeys.length) {
      steamList.appendChild(createElement("p", "admin-empty", "Ничего не найдено. Попробуй другое название, регион или тег."));
      return;
    }

    visibleKeys.forEach(function (item) {
      var button = document.createElement("button");
      var title = createElement("strong", null, item.title);
      var editionsCount = normalizeSteamEditions(item).length;
      var meta = createElement("span", null, (item.platform || "steam") + " · " + (item.region || "Global") + " · " + editionsCount + " вар. · " + (item.active ? "активен" : "скрыт"));

      button.className = "admin-product";
      button.type = "button";
      if (currentSteamKey && currentSteamKey.id === item.id) button.classList.add("is-active");
      button.appendChild(title);
      button.appendChild(meta);
      button.addEventListener("click", function () { fillSteamForm(item); });
      steamList.appendChild(button);
    });
  }

  function clearBuilderLists() {
    benefitsList.replaceChildren();
    detailsList.replaceChildren();
    pricesList.replaceChildren();
    regionsList.replaceChildren();
  }

  function fillForm(product) {
    currentProduct = product;
    slugTouched = Boolean(product.id);
    if (editorTitle) editorTitle.textContent = product.title || "Новый товар";

    form.elements.slug.value = product.slug || "";
    form.elements.title.value = product.title || "";
    form.elements.category.value = product.category || "";
    form.elements.priceFrom.value = product.priceFrom || "";
    form.elements.image.value = product.image || "";
    form.elements.featuredImage.value = product.featuredImage || "";
    form.elements.featuredMobileImage.value = product.featuredMobileImage || "";
    form.elements.featuredTitle.value = product.featuredTitle || "";
    form.elements.filters.value = fromList(product.filters);
    form.elements.items.value = fromList(product.items);
    form.elements.aliases.value = fromList(product.aliases);
    form.elements.sortOrder.value = product.sortOrder || 100;
    form.elements.description.value = product.description || "";
    form.elements.accent.value = product.accent || "#8b5cf6";
    form.elements.accentRgb.value = product.accentRgb || "139, 92, 246";
    form.elements.watermark.value = product.watermark || "";
    form.elements.guarantee.value = product.guarantee || "";
    form.elements.active.checked = product.active !== false;

    clearBuilderLists();
    asArray(product.benefits).forEach(appendBenefit);
    if (!asArray(product.benefits).length) appendBenefit({ icon: "✓", label: "" });
    asArray(product.details).forEach(appendDetail);
    if (!asArray(product.details).length) appendDetail("");
    asArray(product.prices).forEach(function (group) { appendPriceGroup(group, pricesList); });
    if (!asArray(product.prices).length) appendPriceGroup({ title: "Основные позиции", rows: [["", ""]] }, pricesList);
    asArray(product.regions).forEach(appendRegion);

    renderList();
    updatePreview();
  }

  function fillSteamForm(item) {
    if (!steamForm) return;
    currentSteamKey = item;
    if (steamEditorTitle) steamEditorTitle.textContent = item.title || "Новый ключ";

    if (steamForm.elements.keyPlatform) steamForm.elements.keyPlatform.value = item.platform || "steam";
    steamForm.elements.keyTitle.value = item.title || "";
    steamForm.elements.keyRegion.value = item.region || "";
    steamForm.elements.keyPriceLabel.value = item.priceLabel || "";
    steamForm.elements.keyPriceValue.value = item.priceValue || "";
    steamForm.elements.keyTags.value = fromList(item.tags);
    steamForm.elements.keyAliases.value = fromList(item.aliases);
    steamForm.elements.keyCover.value = item.cover || "";
    steamForm.elements.keySortOrder.value = item.sortOrder || 100;
    steamForm.elements.keyActive.checked = item.active !== false;
    if (steamEditionsList) {
      steamEditionsList.replaceChildren();
      normalizeSteamEditions(item).forEach(appendSteamEdition);
    }

    renderSteamList();
  }

  function readSteamForm() {
    return {
      id: currentSteamKey ? currentSteamKey.id : null,
      platform: steamForm.elements.keyPlatform ? steamForm.elements.keyPlatform.value : "steam",
      title: steamForm.elements.keyTitle.value.trim(),
      region: steamForm.elements.keyRegion.value.trim() || "Global",
      priceLabel: steamForm.elements.keyPriceLabel.value.trim(),
      priceValue: Number(steamForm.elements.keyPriceValue.value) || 0,
      tags: toList(steamForm.elements.keyTags.value),
      aliases: toList(steamForm.elements.keyAliases.value),
      cover: steamForm.elements.keyCover.value.trim(),
      editions: readSteamEditions(),
      sortOrder: Number(steamForm.elements.keySortOrder.value) || 100,
      active: steamForm.elements.keyActive.checked
    };
  }

  function readForm() {
    return {
      id: currentProduct ? currentProduct.id : null,
      slug: form.elements.slug.value.trim(),
      title: form.elements.title.value.trim(),
      category: form.elements.category.value.trim(),
      priceFrom: form.elements.priceFrom.value.trim(),
      image: form.elements.image.value.trim(),
      featuredImage: form.elements.featuredImage.value.trim(),
      featuredMobileImage: form.elements.featuredMobileImage.value.trim(),
      featuredTitle: form.elements.featuredTitle.value.trim(),
      filters: toList(form.elements.filters.value),
      items: toList(form.elements.items.value),
      aliases: toList(form.elements.aliases.value),
      sortOrder: Number(form.elements.sortOrder.value) || 100,
      description: form.elements.description.value.trim(),
      accent: form.elements.accent.value.trim() || "#8b5cf6",
      accentRgb: form.elements.accentRgb.value.trim() || "139, 92, 246",
      watermark: form.elements.watermark.value.trim(),
      guarantee: form.elements.guarantee.value.trim(),
      active: form.elements.active.checked,
      benefits: readBenefits(),
      details: readDetails(),
      prices: readPriceGroups(pricesList),
      regions: readRegions()
    };
  }

  function updatePreview() {
    if (!form) return;
    var image = document.querySelector("[data-preview-image]");
    var title = document.querySelector("[data-preview-title]");
    var category = document.querySelector("[data-preview-category]");
    var description = document.querySelector("[data-preview-description]");
    var price = document.querySelector("[data-preview-price]");
    var tags = document.querySelector("[data-preview-tags]");
    var imagePath = form.elements.featuredImage.value.trim() || form.elements.image.value.trim() || "assets/catalog/fortnite-vstore.png";

    if (image) image.src = imagePath;
    if (title) title.textContent = form.elements.featuredTitle.value.trim() || form.elements.title.value.trim() || "Товар";
    if (category) category.textContent = form.elements.category.value.trim() || "Категория";
    if (description) description.textContent = form.elements.description.value.trim() || "Описание товара появится здесь.";
    if (price) price.textContent = form.elements.priceFrom.value.trim() || "по запросу";
    if (tags) {
      tags.replaceChildren();
      toList(form.elements.items.value).slice(0, 4).forEach(function (item) {
        tags.appendChild(createElement("span", null, item));
      });
    }
  }

  async function loadProducts() {
    setStatus(saveStatus, "Загружаю товары...");
    var result = await client
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("title", { ascending: true });

    if (result.error) {
      setStatus(saveStatus, "Ошибка: " + result.error.message);
      return;
    }

    products = (result.data || []).map(rowToProduct);
    renderList();
    if (products.length) fillForm(products[0]);
    else fillForm(createEmptyProduct());
    setStatus(saveStatus, products.length ? "Готово" : "База пустая. Можно импортировать текущий каталог.");
  }

  async function saveProduct(event) {
    event.preventDefault();
    setStatus(saveStatus, "Сохраняю...");

    try {
      var product = readForm();
      if (!product.slug || !product.title) throw new Error("Нужны slug и название.");

      var row = productToRow(product);
      var request = currentProduct && currentProduct.id
        ? client.from("products").update(row).eq("id", currentProduct.id).select("*").single()
        : client.from("products").insert(row).select("*").single();
      var result = await request;

      if (result.error && /platform/i.test(result.error.message || "")) {
        result = await client
          .from("steam_keys")
          .select("*")
          .order("sort_order", { ascending: true })
          .order("title", { ascending: true });
      }

      if (result.error) throw result.error;
      setStatus(saveStatus, "Сохранено");
      await loadProducts();
      if (result.data) fillForm(rowToProduct(result.data));
    } catch (error) {
      setStatus(saveStatus, "Ошибка: " + error.message);
    }
  }

  async function deleteProduct() {
    if (!currentProduct || !currentProduct.id) return;
    if (!window.confirm("Удалить товар " + currentProduct.title + "?")) return;

    setStatus(saveStatus, "Удаляю...");
    var result = await client.from("products").delete().eq("id", currentProduct.id);
    if (result.error) {
      setStatus(saveStatus, "Ошибка: " + result.error.message);
      return;
    }

    currentProduct = null;
    await loadProducts();
  }

  async function importStaticProducts() {
    var staticProducts = window.VSTORE_PRODUCTS || [];
    if (!staticProducts.length) {
      setStatus(saveStatus, "Статичный каталог не найден.");
      return;
    }

    setStatus(saveStatus, "Импортирую " + staticProducts.length + " товаров...");
    var rows = staticProducts.map(function (product, index) {
      var row = productToRow(product);
      row.sort_order = index + 1;
      return row;
    });
    var result = await client
      .from("products")
      .upsert(rows, { onConflict: "slug" })
      .select("id");

    if (result.error) {
      setStatus(saveStatus, "Ошибка импорта: " + result.error.message);
      return;
    }

    setStatus(saveStatus, "Каталог импортирован");
    await loadProducts();
  }

  async function loadSteamKeys() {
    if (!steamList) return;
    setStatus(steamStatus, "Загружаю ключи...");

    try {
      var result = await client
        .from("steam_keys")
        .select("*")
        .order("platform", { ascending: true })
        .order("sort_order", { ascending: true })
        .order("title", { ascending: true });

      if (result.error) throw result.error;
      steamKeys = (result.data || []).map(rowToSteamKey);
      renderSteamList();
      if (steamKeys.length) fillSteamForm(steamKeys[0]);
      else fillSteamForm(createEmptySteamKey());
      setStatus(steamStatus, steamKeys.length ? "Готово" : "Таблица пустая. Можно импортировать текущие ключи.");
    } catch (error) {
      steamKeys = [];
      renderSteamList();
      setStatus(steamStatus, "Ошибка ключей: " + error.message + ". Проверь таблицу steam_keys в Supabase.");
    }
  }

  async function saveSteamKey(event) {
    event.preventDefault();
    setStatus(steamStatus, "Сохраняю ключ...");

    try {
      var item = readSteamForm();
      if (!item.title) throw new Error("Нужно название игры.");

      var row = steamKeyToRow(item);
      var request = currentSteamKey && currentSteamKey.id
        ? client.from("steam_keys").update(row).eq("id", currentSteamKey.id).select("*").single()
        : client.from("steam_keys").insert(row).select("*").single();
      var result = await request;

      if (result.error) throw result.error;
      setStatus(steamStatus, "Ключ сохранён");
      await loadSteamKeys();
      if (result.data) fillSteamForm(rowToSteamKey(result.data));
    } catch (error) {
      setStatus(steamStatus, "Ошибка: " + error.message);
    }
  }

  async function deleteSteamKey() {
    if (!currentSteamKey || !currentSteamKey.id) return;
    if (!window.confirm("Удалить ключ " + currentSteamKey.title + "?")) return;

    setStatus(steamStatus, "Удаляю ключ...");
    var result = await client.from("steam_keys").delete().eq("id", currentSteamKey.id);
    if (result.error) {
      setStatus(steamStatus, "Ошибка: " + result.error.message);
      return;
    }

    currentSteamKey = null;
    await loadSteamKeys();
  }

  async function importStaticSteamKeys() {
    setStatus(steamStatus, "Импортирую ключи...");
    var rows = defaultSteamKeys.map(function (item) {
      return steamKeyToRow(item);
    });
    var result = await client
      .from("steam_keys")
      .upsert(rows, { onConflict: "platform,title,region" })
      .select("id");

    if (result.error) {
      setStatus(steamStatus, "Ошибка импорта: " + result.error.message);
      return;
    }

    setStatus(steamStatus, "Ключи импортированы");
    await loadSteamKeys();
  }

  function switchAdminTab(tab) {
    var isSteam = tab === "steam";
    if (productsPanel) productsPanel.hidden = isSteam;
    if (steamPanel) steamPanel.hidden = !isSteam;
    document.body.dataset.adminMode = isSteam ? "steam" : "products";
    if (window.location.hash !== "#" + tab) {
      window.history.replaceState(null, "", "#" + tab);
    }
    document.querySelectorAll("[data-admin-tab]").forEach(function (button) {
      button.classList.toggle("is-active", button.dataset.adminTab === tab);
    });
    if (isSteam && !steamKeys.length) loadSteamKeys();
    window.requestAnimationFrame(function () {
      var target = isSteam ? steamPanel : productsPanel;
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  async function init() {
    var sessionResult = await client.auth.getSession();
    if (sessionResult.data && sessionResult.data.session) {
      showAdmin();
      loadProducts();
      switchAdminTab(window.location.hash === "#steam" ? "steam" : "products");
    } else {
      showLogin();
    }
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      setStatus(loginStatus, "Вхожу...");
      var data = new FormData(loginForm);
      var result = await client.auth.signInWithPassword({
        email: String(data.get("email") || ""),
        password: String(data.get("password") || "")
      });

      if (result.error) {
        setStatus(loginStatus, result.error.message);
        return;
      }

      setStatus(loginStatus, "");
      showAdmin();
      loadProducts();
      switchAdminTab(window.location.hash === "#steam" ? "steam" : "products");
    });
  }

  if (form) {
    form.addEventListener("submit", saveProduct);
    form.addEventListener("input", function (event) {
      if (event.target.name === "slug") slugTouched = true;
      if (event.target.name === "title" && !slugTouched) {
        form.elements.slug.value = makeSlug(event.target.value);
      }
      updatePreview();
    });
  }

  if (steamForm) {
    steamForm.addEventListener("submit", saveSteamKey);
  }

  if (steamSearchInput) {
    steamSearchInput.addEventListener("input", renderSteamList);
  }

  document.querySelectorAll("[data-admin-tab]").forEach(function (button) {
    button.addEventListener("click", function () {
      switchAdminTab(button.dataset.adminTab || "products");
    });
  });

  var signOut = document.querySelector("[data-sign-out]");
  if (signOut) {
    signOut.addEventListener("click", async function () {
      await client.auth.signOut();
      showLogin();
    });
  }

  var newProduct = document.querySelector("[data-new-product]");
  if (newProduct) {
    newProduct.addEventListener("click", function () {
      fillForm(createEmptyProduct());
      slugTouched = false;
      setStatus(saveStatus, "Новый товар. Slug заполнится от названия.");
    });
  }

  var importProducts = document.querySelector("[data-import-products]");
  if (importProducts) importProducts.addEventListener("click", importStaticProducts);

  var importSteamKeys = document.querySelector("[data-import-steam-keys]");
  if (importSteamKeys) importSteamKeys.addEventListener("click", importStaticSteamKeys);

  var deleteButton = document.querySelector("[data-delete-product]");
  if (deleteButton) deleteButton.addEventListener("click", deleteProduct);

  var deleteSteamButton = document.querySelector("[data-delete-steam-key]");
  if (deleteSteamButton) deleteSteamButton.addEventListener("click", deleteSteamKey);

  var addBenefit = document.querySelector("[data-add-benefit]");
  if (addBenefit) addBenefit.addEventListener("click", function () { appendBenefit({ icon: "✓", label: "" }); });

  var newSteamKey = document.querySelector("[data-new-steam-key]");
  if (newSteamKey) {
    newSteamKey.addEventListener("click", function () {
      fillSteamForm(createEmptySteamKey());
      setStatus(steamStatus, "Новый ключ.");
    });
  }

  var addSteamEdition = document.querySelector("[data-add-steam-edition]");
  if (addSteamEdition) {
    addSteamEdition.addEventListener("click", function () {
      appendSteamEdition({ name: "Standard Edition", region: steamForm.elements.keyRegion.value.trim() || "Global", priceLabel: "", priceValue: 0, note: "" });
    });
  }

  var addDetail = document.querySelector("[data-add-detail]");
  if (addDetail) addDetail.addEventListener("click", function () { appendDetail(""); });

  var addPriceGroup = document.querySelector("[data-add-price-group]");
  if (addPriceGroup) addPriceGroup.addEventListener("click", function () {
    appendPriceGroup({ title: "Прайс", rows: [["", ""]] }, pricesList);
  });

  var addRegion = document.querySelector("[data-add-region]");
  if (addRegion) addRegion.addEventListener("click", function () {
    appendRegion({ code: "", name: "", currency: "", prices: [{ title: "Прайс", rows: [["", ""]] }] });
  });

  initCollapsibleCards();
  init();
})();
