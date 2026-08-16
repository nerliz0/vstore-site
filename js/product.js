(function () {
  "use strict";

  function startProduct() {
  var products = window.VSTORE_PRODUCTS || [];
  var config = window.VSTORE_CONFIG || {};
  var params = new URLSearchParams(window.location.search);
  var requestedSlug = params.get("item") || "fortnite";
  var product = products.find(function (item) {
    return item.slug === requestedSlug;
  });
  var fallbackProduct = products[0];
  var orderPanel = document.querySelector("[data-product-order-panel]");
  var priceLayout = document.querySelector(".product-prices__layout");
  var orderImage = document.querySelector("[data-order-image]");
  var prices = document.querySelector("[data-product-prices]");
  var pricesEmpty = document.querySelector("[data-product-prices-empty]");
  var regionPicker = document.querySelector("[data-product-regions]");
  var regionList = document.querySelector("[data-product-region-list]");
  var regionStatus = document.querySelector("[data-product-region-status]");
  var selectedPriceCard = null;
  var selectedRegion = null;
  var selectedOptionName = "";
  var selectedOptionPrice = "";
  var recentRepeatItem = null;

  if (!product) {
    product = fallbackProduct;
    if (product) {
      window.history.replaceState(null, "", "product.html?item=" + product.slug);
    }
  }

  if (!product) {
    document.body.classList.add("has-data-error");
    return;
  }

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

  function createBenefit(benefit, index) {
    var item = document.createElement("article");
    var icon = document.createElement("span");
    var copy = document.createElement("span");

    item.className = "product-benefit";
    icon.className = "product-benefit__icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = benefit.icon || ["✓", "↯", "◇", "◎"][index % 4];
    copy.textContent = benefit.label || benefit;

    item.appendChild(icon);
    item.appendChild(copy);
    return item;
  }

  function createDetailItem(text, index) {
    var item = document.createElement("article");
    var marker = document.createElement("span");
    var copy = document.createElement("p");

    item.className = "product-info-item";
    marker.className = "product-info-item__marker";
    marker.setAttribute("aria-hidden", "true");
    marker.textContent = String(index + 1).padStart(2, "0");
    copy.textContent = text;

    item.appendChild(marker);
    item.appendChild(copy);
    return item;
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
      item.setAttribute("aria-pressed", "false");
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

  function createRegionButton(region) {
    var button = document.createElement("button");
    var code = document.createElement("span");
    var copy = document.createElement("span");
    var name = document.createElement("strong");
    var currency = document.createElement("small");

    button.className = "product-region";
    button.type = "button";
    button.setAttribute("aria-pressed", "false");
    button.dataset.regionCode = region.code;
    code.className = "product-region__code";
    code.textContent = region.code;
    copy.className = "product-region__copy";
    name.textContent = region.name;
    currency.textContent = "Номиналы в " + region.currency;
    copy.appendChild(name);
    copy.appendChild(currency);
    button.appendChild(code);
    button.appendChild(copy);
    button.addEventListener("click", function () {
      selectRegion(region, button);
    });

    return button;
  }

  function renderPriceGroups(groups) {
    if (!prices) return;
    prices.replaceChildren();
    (groups || []).forEach(function (group) {
      prices.appendChild(createPriceGroup(group));
    });
  }

  function selectRegion(region, button) {
    selectedRegion = region;

    if (regionList) {
      regionList.querySelectorAll(".product-region").forEach(function (item) {
        var isActive = item === button;
        item.classList.toggle("is-selected", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });
    }

    clearSelection();
    renderPriceGroups(region.prices);
    if (prices) prices.hidden = false;
    if (pricesEmpty) pricesEmpty.hidden = true;
    if (regionStatus) regionStatus.textContent = "Выбран регион: " + region.name;

    var orderRegionRow = document.querySelector("[data-order-region-row]");
    if (orderRegionRow) orderRegionRow.hidden = false;
    setText("[data-order-region]", region.name + " (" + region.code + ")");
  }

  function buildTelegramLink(optionName, optionPrice) {
    var managerUrl = config.telegram || "https://t.me/MenagerVstore";
    var text = [
      "Здравствуйте!",
      "",
      config.orderPrefix || "Хочу купить:",
      product.title,
      selectedRegion ? "Регион: " + selectedRegion.name + " (" + selectedRegion.code + ")" : "",
      optionName,
      optionPrice
    ].filter(Boolean).join("\n");

    return managerUrl.replace(/\/?$/, "") + "?text=" + encodeURIComponent(text);
  }

  function addCurrentSelectionToCart() {
    if (!selectedOptionName || !selectedOptionPrice || !window.VSTORE_CART) return false;
    return window.VSTORE_CART.add({
      slug: product.slug,
      title: product.title,
      image: product.image,
      regionCode: selectedRegion ? selectedRegion.code : "",
      regionName: selectedRegion ? selectedRegion.name : "",
      optionName: selectedOptionName,
      priceLabel: selectedOptionPrice
    });
  }

  function addRepeatItemToCart() {
    if (!recentRepeatItem || !window.VSTORE_CART) return false;
    return window.VSTORE_CART.add(recentRepeatItem);
  }

  function createRepeatHint(item) {
    var hint = document.createElement("aside");
    var copy = document.createElement("div");
    var eyebrow = document.createElement("span");
    var title = document.createElement("strong");
    var meta = document.createElement("p");
    var button = document.createElement("button");

    hint.className = "product-repeat";
    hint.setAttribute("aria-label", "Быстрый повтор заказа");
    copy.className = "product-repeat__copy";
    eyebrow.textContent = "Вы брали недавно";
    title.textContent = item.optionName || "Позиция из каталога";
    meta.textContent = [
      item.regionName,
      item.priceLabel
    ].filter(Boolean).join(" · ");
    button.className = "product-repeat__button";
    button.type = "button";
    button.textContent = "Повторить";
    button.addEventListener("click", addRepeatItemToCart);

    copy.appendChild(eyebrow);
    copy.appendChild(title);
    copy.appendChild(meta);
    hint.appendChild(copy);
    hint.appendChild(button);
    return hint;
  }

  function initRepeatHint() {
    if (!window.VSTORE_CART || typeof window.VSTORE_CART.getRecent !== "function") return;
    recentRepeatItem = window.VSTORE_CART.getRecent(product.slug);
    if (!recentRepeatItem) return;

    var pricesHead = document.querySelector(".product-prices__head");
    if (pricesHead) {
      pricesHead.insertAdjacentElement("afterend", createRepeatHint(recentRepeatItem));
    }
  }

  function selectPrice(card, optionName, optionPrice) {
    if (selectedPriceCard) {
      selectedPriceCard.classList.remove("is-selected");
      selectedPriceCard.setAttribute("aria-pressed", "false");
    }

    selectedPriceCard = card;
    selectedOptionName = optionName;
    selectedOptionPrice = optionPrice;
    card.classList.add("is-selected");
    card.setAttribute("aria-pressed", "true");

    if (orderPanel) orderPanel.classList.remove("is-empty");
    if (priceLayout) priceLayout.classList.add("has-order");

    setText("[data-order-product]", product.title);
    setText("[data-order-name]", optionName);
    setText("[data-order-price]", optionPrice);

    if (orderImage) {
      orderImage.src = product.image;
      orderImage.alt = product.title;
    }

    var orderLink = document.querySelector("[data-order-link]");
    if (orderLink) orderLink.href = buildTelegramLink(optionName, optionPrice);

    if (orderPanel && window.matchMedia("(max-width: 900px)").matches) {
      window.setTimeout(function () {
        orderPanel.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
          block: "start"
        });
      }, 80);
    }
  }

  function clearSelection() {
    if (selectedPriceCard) {
      selectedPriceCard.classList.remove("is-selected");
      selectedPriceCard.setAttribute("aria-pressed", "false");
      selectedPriceCard = null;
    }
    selectedOptionName = "";
    selectedOptionPrice = "";

    if (orderPanel) orderPanel.classList.add("is-empty");
    if (priceLayout) priceLayout.classList.remove("has-order");

    setText("[data-order-product]", product.title);
    setText("[data-order-name]", "Выберите позицию из прайса");
    setText("[data-order-price]", product.priceFrom || "—");

    var orderLink = document.querySelector("[data-order-link]");
    if (orderLink) {
      orderLink.href = buildTelegramLink("Позиция из каталога", product.priceFrom || "по запросу");
    }
  }

  function updateMetadata() {
    var title = product.title + " — купить в Vstore";
    var description = product.description + " Цена " + product.priceFrom + ". Оформление через Telegram.";
    var metaDescription = document.querySelector('meta[name="description"]');
    var canonical = document.querySelector('link[rel="canonical"]');
    var productUrl = new URL("product.html?item=" + product.slug, window.location.href).href;
    var imageUrl = new URL(product.image, window.location.href).href;

    document.title = title;
    if (metaDescription) metaDescription.setAttribute("content", description);
    if (canonical) canonical.setAttribute("href", productUrl);

    document.querySelectorAll('[property="og:title"]').forEach(function (node) {
      node.setAttribute("content", title);
    });
    document.querySelectorAll('[property="og:description"]').forEach(function (node) {
      node.setAttribute("content", description);
    });
    document.querySelectorAll('[property="og:image"]').forEach(function (node) {
      node.setAttribute("content", imageUrl);
    });
    document.querySelectorAll('[property="og:url"]').forEach(function (node) {
      node.setAttribute("content", productUrl);
    });
  }

  setText("[data-product-title]", product.title);
  setText("[data-product-category]", product.category);
  setText("[data-product-description]", product.description);
  setText("[data-product-guarantee]", product.guarantee || "Гарантия после выдачи");

  var panel = document.querySelector("[data-product-panel]");
  if (product.accent) document.documentElement.style.setProperty("--product-accent", product.accent);
  if (product.accentRgb) document.documentElement.style.setProperty("--product-accent-rgb", product.accentRgb);
  if (panel) {
    panel.dataset.productWatermark = product.watermark || product.title;
    if (product.accent) panel.style.setProperty("--product-accent", product.accent);
    if (product.accentRgb) panel.style.setProperty("--product-accent-rgb", product.accentRgb);
  }

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

  var benefits = document.querySelector("[data-product-benefits]");
  if (benefits) {
    var productBenefits = product.benefits || [
      { icon: "✓", label: "Ручная проверка" },
      { icon: "↯", label: "Ответ 5-15 минут" },
      { icon: "◇", label: "Оформление через Telegram" },
      { icon: "◎", label: product.guarantee || "Гарантия после выдачи" }
    ];
    productBenefits.forEach(function (benefit, index) {
      benefits.appendChild(createBenefit(benefit, index));
    });
  }

  var details = document.querySelector("[data-product-details]");
  if (details) {
    (product.details || [product.description]).forEach(function (detail, index) {
      details.appendChild(createDetailItem(detail, index));
    });
  }

  if (Array.isArray(product.regions) && product.regions.length) {
    if (regionPicker) regionPicker.hidden = false;
    if (prices) prices.hidden = true;
    if (pricesEmpty) pricesEmpty.hidden = false;
    if (regionList) {
      product.regions.forEach(function (region) {
        regionList.appendChild(createRegionButton(region));
      });
    }
  } else {
    renderPriceGroups(product.prices);
  }

  var order = document.querySelector("[data-product-order]");
  if (order) {
    order.href = buildTelegramLink("Позиция из каталога", product.priceFrom || "по запросу");
  }

  var clear = document.querySelector("[data-order-clear]");
  if (clear) clear.addEventListener("click", clearSelection);

  var actions = document.querySelector(".product-actions");
  if (actions && window.VSTORE_FAVORITES && typeof window.VSTORE_FAVORITES.createToggle === "function") {
    actions.appendChild(window.VSTORE_FAVORITES.createToggle(product, {
      inline: true,
      label: true
    }));
    window.VSTORE_FAVORITES.refresh();
  }

  var addCart = document.querySelector("[data-add-cart]");
  if (addCart) {
    addCart.addEventListener("click", function () {
      addCurrentSelectionToCart();
    });
  }

  initRepeatHint();
  updateMetadata();
  }

  Promise.resolve(window.VSTORE_PRODUCTS_READY || window.VSTORE_PRODUCTS)
    .then(startProduct)
    .catch(startProduct);
})();
