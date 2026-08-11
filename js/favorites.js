(function () {
  "use strict";

  var STORAGE_KEY = "vstore-favorites-v1";
  var products = window.VSTORE_PRODUCTS || [];
  var favorites = readFavorites();
  var ui = null;

  function text(value, fallback) {
    var result = String(value == null ? "" : value).trim();
    return result || fallback || "";
  }

  function getProduct(slug) {
    return products.find(function (product) {
      return product.slug === slug;
    }) || null;
  }

  function normalizeItem(item) {
    if (!item || typeof item !== "object") return null;
    var slug = text(item.slug).slice(0, 80);
    if (!slug) return null;
    var product = getProduct(slug);

    return {
      slug: slug,
      title: text(product && product.title, text(item.title, "Товар")).slice(0, 120),
      image: text(product && product.image, text(item.image)).slice(0, 240),
      priceFrom: text(product && product.priceFrom, text(item.priceFrom)).slice(0, 40),
      category: text(product && product.category, text(item.category)).slice(0, 80),
      addedAt: Number(item.addedAt) || Date.now()
    };
  }

  function readFavorites() {
    try {
      var stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
      if (!Array.isArray(stored)) return [];
      return stored.map(normalizeItem).filter(Boolean).slice(0, 60);
    } catch (error) {
      return [];
    }
  }

  function saveFavorites() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      // Favorites still work for the current tab if storage is unavailable.
    }
  }

  function isFavorite(slug) {
    return favorites.some(function (item) {
      return item.slug === slug;
    });
  }

  function getCount() {
    return favorites.length;
  }

  function notifyChange() {
    saveFavorites();
    render();
    updateFavoriteButtons();
    window.dispatchEvent(new CustomEvent("vstore:favorites-change", {
      detail: { count: getCount(), items: getItems() }
    }));
  }

  function addFavorite(productLike) {
    var normalized = normalizeItem(productLike);
    if (!normalized || isFavorite(normalized.slug)) return false;
    favorites.unshift(normalized);
    notifyChange();
    return true;
  }

  function removeFavorite(slug) {
    var next = favorites.filter(function (item) {
      return item.slug !== slug;
    });
    if (next.length === favorites.length) return false;
    favorites = next;
    notifyChange();
    return true;
  }

  function toggleFavorite(productLike) {
    var slug = text(productLike && productLike.slug);
    if (!slug) return false;
    if (isFavorite(slug)) {
      removeFavorite(slug);
      return false;
    }
    addFavorite(productLike);
    return true;
  }

  function getItems() {
    return favorites.map(function (item) {
      return Object.assign({}, item);
    });
  }

  function createFavoriteItem(item) {
    var row = document.createElement("article");
    var imageWrap = document.createElement("a");
    var image = document.createElement("img");
    var content = document.createElement("div");
    var title = document.createElement("a");
    var meta = document.createElement("p");
    var actions = document.createElement("div");
    var open = document.createElement("a");
    var remove = document.createElement("button");
    var href = "product.html?item=" + encodeURIComponent(item.slug);

    row.className = "favorite-item";
    imageWrap.className = "favorite-item__image";
    imageWrap.href = href;
    image.src = item.image;
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";
    imageWrap.appendChild(image);

    content.className = "favorite-item__content";
    title.className = "favorite-item__title";
    title.href = href;
    title.textContent = item.title;
    meta.className = "favorite-item__meta";
    meta.textContent = [item.category, item.priceFrom].filter(Boolean).join(" · ");

    actions.className = "favorite-item__actions";
    open.className = "favorite-item__open";
    open.href = href;
    open.textContent = "Открыть";
    remove.className = "favorite-item__remove";
    remove.type = "button";
    remove.textContent = "Убрать";
    remove.addEventListener("click", function () {
      removeFavorite(item.slug);
    });

    actions.appendChild(open);
    actions.appendChild(remove);
    content.appendChild(title);
    content.appendChild(meta);
    content.appendChild(actions);
    row.appendChild(imageWrap);
    row.appendChild(content);
    return row;
  }

  function render() {
    if (!ui) return;
    var count = getCount();
    var hasItems = count > 0;

    ui.count.textContent = count;
    ui.count.hidden = count === 0;
    ui.trigger.setAttribute("aria-label", count ? "Избранное, товаров: " + count : "Избранное пусто");
    ui.summary.textContent = count ? count + " " + pluralizeProducts(count) : "Сохраняйте товары сердечком";
    ui.empty.hidden = hasItems;
    ui.list.hidden = !hasItems;
    ui.clear.hidden = !hasItems;
    ui.list.replaceChildren();

    favorites.forEach(function (item) {
      ui.list.appendChild(createFavoriteItem(item));
    });
  }

  function pluralizeProducts(count) {
    var mod10 = count % 10;
    var mod100 = count % 100;
    if (mod10 === 1 && mod100 !== 11) return "товар";
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "товара";
    return "товаров";
  }

  function openPanel() {
    if (!ui) return;
    ui.lastFocused = document.activeElement;
    ui.layer.classList.add("is-open");
    ui.layer.setAttribute("aria-hidden", "false");
    ui.trigger.setAttribute("aria-expanded", "true");
    document.body.classList.add("favorites-open");
    window.setTimeout(function () {
      ui.close.focus();
    }, 60);
  }

  function closePanel(restoreFocus) {
    if (!ui) return;
    ui.layer.classList.remove("is-open");
    ui.layer.setAttribute("aria-hidden", "true");
    ui.trigger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("favorites-open");
    if (restoreFocus !== false && ui.lastFocused && typeof ui.lastFocused.focus === "function") {
      ui.lastFocused.focus();
    }
  }

  function getFocusableElements() {
    if (!ui) return [];
    return Array.prototype.slice.call(ui.panel.querySelectorAll("button:not([disabled]), a[href]"));
  }

  function updateFavoriteButtons() {
    document.querySelectorAll("[data-favorite-toggle]").forEach(function (button) {
      var slug = button.getAttribute("data-favorite-toggle");
      var active = isFavorite(slug);
      button.classList.toggle("is-favorite", active);
      button.setAttribute("aria-pressed", String(active));
      button.setAttribute("aria-label", active ? "Убрать из избранного" : "Добавить в избранное");
      var label = button.querySelector("[data-favorite-label]");
      if (label) label.textContent = active ? "В избранном" : "В избранное";
    });
  }

  function createToggle(product, options) {
    var button = document.createElement(options && options.inline ? "button" : "span");
    button.className = options && options.inline ? "favorite-toggle favorite-toggle--inline" : "favorite-toggle";
    button.setAttribute("data-favorite-toggle", product.slug);
    button.setAttribute("aria-pressed", "false");
    if (!options || !options.inline) button.setAttribute("role", "button");
    if (!options || !options.inline) button.setAttribute("tabindex", "0");
    if (options && options.inline) button.type = "button";
    button.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.2-9.1-8.2C1.2 8.5 3.2 5 6.8 5c2 0 3.4 1 4.2 2.2C11.8 6 13.2 5 15.2 5c3.6 0 5.6 3.5 3.9 6.8C19 15.8 12 20 12 20Z"></path></svg>' +
      (options && options.label ? '<span data-favorite-label>В избранное</span>' : "");

    function activate(event) {
      event.preventDefault();
      event.stopPropagation();
      toggleFavorite(product);
    }

    button.addEventListener("click", activate);
    if (!options || !options.inline) {
      button.addEventListener("keydown", function (event) {
        if (event.key !== "Enter" && event.key !== " ") return;
        activate(event);
      });
    }

    return button;
  }

  function initFavoritesUI() {
    if (ui || document.querySelector("[data-favorites-layer]")) return;
    var header = document.querySelector(".header");
    if (!header) return;

    var trigger = document.createElement("button");
    var layer = document.createElement("div");

    trigger.className = "header-favorites";
    trigger.type = "button";
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.setAttribute("aria-expanded", "false");
    trigger.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.2-9.1-8.2C1.2 8.5 3.2 5 6.8 5c2 0 3.4 1 4.2 2.2C11.8 6 13.2 5 15.2 5c3.6 0 5.6 3.5 3.9 6.8C19 15.8 12 20 12 20Z"></path></svg>' +
      '<span class="header-favorites__label">Избранное</span>' +
      '<span class="header-favorites__count" data-favorites-count hidden>0</span>';
    header.appendChild(trigger);

    layer.className = "favorites-layer";
    layer.setAttribute("data-favorites-layer", "");
    layer.setAttribute("aria-hidden", "true");
    layer.innerHTML =
      '<button class="favorites-layer__backdrop" type="button" tabindex="-1" aria-label="Закрыть избранное" data-favorites-close></button>' +
      '<aside class="favorites-panel" role="dialog" aria-modal="true" aria-labelledby="favorites-title">' +
        '<header class="favorites-panel__head">' +
          '<div><p>Быстрый доступ</p><h2 id="favorites-title">Избранное</h2><span data-favorites-summary>Сохраняйте товары сердечком</span></div>' +
          '<button class="favorites-panel__close" type="button" aria-label="Закрыть избранное" data-favorites-close>×</button>' +
        '</header>' +
        '<div class="favorites-panel__body">' +
          '<div class="favorites-empty" data-favorites-empty>' +
            '<span class="favorites-empty__icon" aria-hidden="true">♡</span>' +
            '<strong>Пока ничего нет</strong>' +
            '<p>Нажмите сердечко на товаре, чтобы быстро вернуться к нему позже.</p>' +
            '<a class="btn favorites-empty__link" href="catalog.html">Открыть каталог</a>' +
          '</div>' +
          '<div class="favorites-list" data-favorites-list hidden></div>' +
        '</div>' +
        '<footer class="favorites-panel__footer">' +
          '<button class="favorites-panel__clear" type="button" data-favorites-clear hidden>Очистить избранное</button>' +
        '</footer>' +
      '</aside>';
    document.body.appendChild(layer);

    ui = {
      trigger: trigger,
      count: trigger.querySelector("[data-favorites-count]"),
      layer: layer,
      panel: layer.querySelector(".favorites-panel"),
      close: layer.querySelector(".favorites-panel__close"),
      summary: layer.querySelector("[data-favorites-summary]"),
      list: layer.querySelector("[data-favorites-list]"),
      empty: layer.querySelector("[data-favorites-empty]"),
      clear: layer.querySelector("[data-favorites-clear]"),
      lastFocused: null
    };

    trigger.addEventListener("click", openPanel);
    layer.querySelectorAll("[data-favorites-close]").forEach(function (button) {
      button.addEventListener("click", function () {
        closePanel(true);
      });
    });
    ui.clear.addEventListener("click", function () {
      favorites = [];
      notifyChange();
    });

    document.addEventListener("keydown", function (event) {
      if (!ui.layer.classList.contains("is-open")) return;
      if (event.key === "Escape") {
        event.preventDefault();
        closePanel(true);
        return;
      }
      if (event.key !== "Tab") return;
      var focusable = getFocusableElements();
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    render();
    updateFavoriteButtons();
  }

  window.addEventListener("storage", function (event) {
    if (event.key !== STORAGE_KEY) return;
    favorites = readFavorites();
    render();
    updateFavoriteButtons();
  });

  window.VSTORE_FAVORITES = {
    add: addFavorite,
    remove: removeFavorite,
    toggle: toggleFavorite,
    has: isFavorite,
    createToggle: createToggle,
    refresh: updateFavoriteButtons,
    open: openPanel,
    close: closePanel,
    getItems: getItems,
    getCount: getCount
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initFavoritesUI);
  } else {
    initFavoritesUI();
  }
})();
