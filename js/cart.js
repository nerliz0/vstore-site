(function () {
  "use strict";

  var STORAGE_KEY = "vstore-cart-v1";
  var MAX_UNIQUE_ITEMS = 30;
  var MAX_QUANTITY = 99;
  var config = window.VSTORE_CONFIG || {};
  var items = readItems();
  var ui = null;

  function text(value, fallback) {
    var result = String(value == null ? "" : value).trim();
    return result || fallback || "";
  }

  function parsePrice(value) {
    var numeric = String(value == null ? "" : value).replace(/[^0-9]/g, "");
    return numeric ? Number(numeric) : 0;
  }

  function makeId(item) {
    return [
      text(item.slug, "product"),
      text(item.regionCode),
      text(item.optionName)
    ].join("|");
  }

  function normalizeItem(item) {
    if (!item || typeof item !== "object") return null;

    var normalized = {
      slug: text(item.slug, "product").slice(0, 80),
      title: text(item.title, "Товар").slice(0, 120),
      image: text(item.image).slice(0, 240),
      regionCode: text(item.regionCode).slice(0, 12),
      regionName: text(item.regionName).slice(0, 80),
      optionName: text(item.optionName, "Позиция из каталога").slice(0, 180),
      priceLabel: text(item.priceLabel, "0 ₽").slice(0, 40),
      priceValue: Number(item.priceValue) || parsePrice(item.priceLabel),
      quantity: Math.min(MAX_QUANTITY, Math.max(1, Number(item.quantity) || 1))
    };

    if (!Number.isFinite(normalized.priceValue) || normalized.priceValue < 0) return null;
    normalized.priceValue = Math.round(normalized.priceValue);
    normalized.id = makeId(normalized);
    return normalized;
  }

  function readItems() {
    try {
      var stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
      if (!Array.isArray(stored)) return [];
      return stored.map(normalizeItem).filter(Boolean).slice(0, MAX_UNIQUE_ITEMS);
    } catch (error) {
      return [];
    }
  }

  function saveItems() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      // The cart remains available for the current page if storage is blocked.
    }
  }

  function getCount() {
    return items.reduce(function (sum, item) {
      return sum + item.quantity;
    }, 0);
  }

  function getTotal() {
    return items.reduce(function (sum, item) {
      return sum + item.priceValue * item.quantity;
    }, 0);
  }

  function formatPrice(value) {
    return new Intl.NumberFormat("ru-RU").format(value) + " ₽";
  }

  function buildCheckoutLink() {
    var managerUrl = config.telegram || "https://t.me/MenagerVstore";
    var lines = ["Здравствуйте!", "", "Хочу оформить заказ из корзины:", ""];

    items.forEach(function (item, index) {
      lines.push((index + 1) + ". " + item.title);
      if (item.regionName) {
        lines.push("Регион: " + item.regionName + (item.regionCode ? " (" + item.regionCode + ")" : ""));
      }
      lines.push("Позиция: " + item.optionName);
      lines.push("Количество: " + item.quantity);
      lines.push("Стоимость: " + formatPrice(item.priceValue * item.quantity));
      lines.push("");
    });

    lines.push("Итого: " + formatPrice(getTotal()));
    return managerUrl.replace(/\/?$/, "") + "?text=" + encodeURIComponent(lines.join("\n"));
  }

  function notifyChange() {
    saveItems();
    render();
    window.dispatchEvent(new CustomEvent("vstore:cart-change", {
      detail: { count: getCount(), total: getTotal() }
    }));
  }

  function addItem(item) {
    var normalized = normalizeItem(item);
    if (!normalized) return false;

    var existing = items.find(function (entry) {
      return entry.id === normalized.id;
    });

    if (existing) {
      existing.title = normalized.title;
      existing.image = normalized.image;
      existing.regionName = normalized.regionName;
      existing.priceLabel = normalized.priceLabel;
      existing.priceValue = normalized.priceValue;
      existing.quantity = Math.min(MAX_QUANTITY, existing.quantity + normalized.quantity);
    } else {
      if (items.length >= MAX_UNIQUE_ITEMS) return false;
      items.push(normalized);
    }

    notifyChange();
    openCart();
    return true;
  }

  function removeItem(id) {
    items = items.filter(function (item) {
      return item.id !== id;
    });
    notifyChange();
  }

  function setQuantity(id, quantity) {
    var item = items.find(function (entry) {
      return entry.id === id;
    });
    if (!item) return;
    item.quantity = Math.min(MAX_QUANTITY, Math.max(1, quantity));
    notifyChange();
  }

  function createCartItem(item) {
    var row = document.createElement("article");
    var imageWrap = document.createElement("a");
    var image = document.createElement("img");
    var content = document.createElement("div");
    var heading = document.createElement("div");
    var title = document.createElement("a");
    var remove = document.createElement("button");
    var meta = document.createElement("p");
    var controls = document.createElement("div");
    var stepper = document.createElement("div");
    var minus = document.createElement("button");
    var quantity = document.createElement("strong");
    var plus = document.createElement("button");
    var price = document.createElement("strong");
    var productUrl = "product.html?item=" + encodeURIComponent(item.slug);

    row.className = "cart-item";
    row.dataset.cartItem = item.id;
    imageWrap.className = "cart-item__image";
    imageWrap.href = productUrl;
    image.src = item.image;
    image.alt = "";
    image.loading = "lazy";
    image.decoding = "async";
    imageWrap.appendChild(image);

    content.className = "cart-item__content";
    heading.className = "cart-item__heading";
    title.className = "cart-item__title";
    title.href = productUrl;
    title.textContent = item.title;
    remove.className = "cart-item__remove";
    remove.type = "button";
    remove.setAttribute("aria-label", "Удалить " + item.title + " из корзины");
    remove.textContent = "×";
    remove.addEventListener("click", function () {
      removeItem(item.id);
    });
    heading.appendChild(title);
    heading.appendChild(remove);

    meta.className = "cart-item__meta";
    meta.textContent = (item.regionName ? item.regionName + " · " : "") + item.optionName;

    controls.className = "cart-item__controls";
    stepper.className = "cart-stepper";
    minus.type = "button";
    minus.setAttribute("aria-label", "Уменьшить количество");
    minus.textContent = "−";
    minus.disabled = item.quantity <= 1;
    minus.addEventListener("click", function () {
      setQuantity(item.id, item.quantity - 1);
    });
    quantity.textContent = item.quantity;
    quantity.setAttribute("aria-label", "Количество: " + item.quantity);
    plus.type = "button";
    plus.setAttribute("aria-label", "Увеличить количество");
    plus.textContent = "+";
    plus.disabled = item.quantity >= MAX_QUANTITY;
    plus.addEventListener("click", function () {
      setQuantity(item.id, item.quantity + 1);
    });
    stepper.appendChild(minus);
    stepper.appendChild(quantity);
    stepper.appendChild(plus);

    price.className = "cart-item__price";
    price.textContent = formatPrice(item.priceValue * item.quantity);
    controls.appendChild(stepper);
    controls.appendChild(price);

    content.appendChild(heading);
    content.appendChild(meta);
    content.appendChild(controls);
    row.appendChild(imageWrap);
    row.appendChild(content);
    return row;
  }

  function render() {
    if (!ui) return;

    var count = getCount();
    var hasItems = items.length > 0;
    ui.count.textContent = count;
    ui.count.hidden = count === 0;
    ui.trigger.setAttribute("aria-label", count ? "Корзина, товаров: " + count : "Корзина пуста");
    ui.summary.textContent = count + " " + pluralizeProducts(count);
    ui.total.textContent = formatPrice(getTotal());
    ui.checkout.href = hasItems ? buildCheckoutLink() : "catalog.html";
    ui.checkout.textContent = hasItems ? "Оформить в Telegram" : "Перейти в каталог";
    ui.checkout.target = hasItems ? "_blank" : "";
    ui.checkout.rel = hasItems ? "noopener noreferrer" : "";
    ui.clear.hidden = !hasItems;
    ui.empty.hidden = hasItems;
    ui.list.hidden = !hasItems;
    ui.footer.classList.toggle("is-empty", !hasItems);
    ui.list.replaceChildren();

    items.forEach(function (item) {
      ui.list.appendChild(createCartItem(item));
    });
  }

  function pluralizeProducts(count) {
    var mod10 = count % 10;
    var mod100 = count % 100;
    if (mod10 === 1 && mod100 !== 11) return "товар";
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "товара";
    return "товаров";
  }

  function getFocusableElements() {
    if (!ui) return [];
    return Array.prototype.slice.call(ui.panel.querySelectorAll("button:not([disabled]), a[href]"));
  }

  function openCart() {
    if (!ui) return;
    ui.lastFocused = document.activeElement;
    ui.layer.classList.add("is-open");
    ui.layer.setAttribute("aria-hidden", "false");
    ui.trigger.setAttribute("aria-expanded", "true");
    document.body.classList.add("cart-open");
    window.setTimeout(function () {
      ui.close.focus();
    }, 60);
  }

  function closeCart(restoreFocus) {
    if (!ui) return;
    ui.layer.classList.remove("is-open");
    ui.layer.setAttribute("aria-hidden", "true");
    ui.trigger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("cart-open");
    if (restoreFocus !== false && ui.lastFocused && typeof ui.lastFocused.focus === "function") {
      ui.lastFocused.focus();
    }
  }

  function initCartUI() {
    if (ui || document.querySelector("[data-cart-layer]")) return;
    var header = document.querySelector(".header");
    if (!header) return;

    var trigger = document.createElement("button");
    var layer = document.createElement("div");
    trigger.className = "header-cart";
    trigger.type = "button";
    trigger.setAttribute("aria-haspopup", "dialog");
    trigger.setAttribute("aria-expanded", "false");
    trigger.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 7h12l-1 12H7L6 7Z"></path><path d="M9 7V5a3 3 0 0 1 6 0v2"></path></svg>' +
      '<span class="header-cart__label">Корзина</span>' +
      '<span class="header-cart__count" data-cart-count hidden>0</span>';
    header.appendChild(trigger);

    layer.className = "cart-layer";
    layer.setAttribute("data-cart-layer", "");
    layer.setAttribute("aria-hidden", "true");
    layer.innerHTML =
      '<button class="cart-layer__backdrop" type="button" tabindex="-1" aria-label="Закрыть корзину" data-cart-close></button>' +
      '<aside class="cart-panel" role="dialog" aria-modal="true" aria-labelledby="cart-title">' +
        '<header class="cart-panel__head">' +
          '<div><p>Ваш заказ</p><h2 id="cart-title">Корзина</h2><span data-cart-summary>0 товаров</span></div>' +
          '<button class="cart-panel__close" type="button" aria-label="Закрыть корзину" data-cart-close>×</button>' +
        '</header>' +
        '<div class="cart-panel__body">' +
          '<div class="cart-empty" data-cart-empty>' +
            '<span class="cart-empty__icon" aria-hidden="true">+</span>' +
            '<strong>Корзина пока пуста</strong>' +
            '<p>Выберите регион и позицию в карточке товара.</p>' +
          '</div>' +
          '<div class="cart-list" data-cart-list hidden></div>' +
        '</div>' +
        '<footer class="cart-panel__footer" data-cart-footer>' +
          '<div class="cart-panel__total"><span>Итого</span><strong data-cart-total>0 ₽</strong></div>' +
          '<a class="btn cart-panel__checkout" href="catalog.html" data-cart-checkout>Перейти в каталог</a>' +
          '<button class="cart-panel__clear" type="button" data-cart-clear hidden>Очистить корзину</button>' +
        '</footer>' +
      '</aside>';
    document.body.appendChild(layer);

    ui = {
      trigger: trigger,
      count: trigger.querySelector("[data-cart-count]"),
      layer: layer,
      panel: layer.querySelector(".cart-panel"),
      close: layer.querySelector(".cart-panel__close"),
      summary: layer.querySelector("[data-cart-summary]"),
      list: layer.querySelector("[data-cart-list]"),
      empty: layer.querySelector("[data-cart-empty]"),
      footer: layer.querySelector("[data-cart-footer]"),
      total: layer.querySelector("[data-cart-total]"),
      checkout: layer.querySelector("[data-cart-checkout]"),
      clear: layer.querySelector("[data-cart-clear]"),
      lastFocused: null
    };

    trigger.addEventListener("click", openCart);
    layer.querySelectorAll("[data-cart-close]").forEach(function (button) {
      button.addEventListener("click", function () {
        closeCart(true);
      });
    });
    ui.clear.addEventListener("click", function () {
      items = [];
      notifyChange();
    });
    ui.checkout.addEventListener("click", function () {
      if (items.length) closeCart(false);
    });

    document.addEventListener("keydown", function (event) {
      if (!ui.layer.classList.contains("is-open")) return;
      if (event.key === "Escape") {
        event.preventDefault();
        closeCart(true);
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
  }

  window.addEventListener("storage", function (event) {
    if (event.key !== STORAGE_KEY) return;
    items = readItems();
    render();
  });

  window.VSTORE_CART = {
    add: addItem,
    open: openCart,
    close: closeCart,
    getItems: function () {
      return items.map(function (item) {
        return Object.assign({}, item);
      });
    },
    getCount: getCount,
    getTotal: getTotal
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCartUI);
  } else {
    initCartUI();
  }
})();
