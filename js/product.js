(function () {
  "use strict";

  var products = window.VSTORE_PRODUCTS || [];
  var config = window.VSTORE_CONFIG || {};
  var params = new URLSearchParams(window.location.search);
  var requestedSlug = params.get("item") || "fortnite";
  var product = products.find(function (item) {
    return item.slug === requestedSlug;
  });
  var fallbackProduct = products[0];
  var orderPanel = document.querySelector("[data-product-order-panel]");
  var orderImage = document.querySelector("[data-order-image]");
  var selectedPriceCard = null;

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

  function buildTelegramLink(optionName, optionPrice) {
    var managerUrl = config.telegram || "https://t.me/MenagerVstore";
    var text = [
      "Здравствуйте!",
      "",
      config.orderPrefix || "Хочу купить:",
      product.title,
      optionName,
      optionPrice
    ].join("\n");

    return managerUrl.replace(/\/?$/, "") + "?text=" + encodeURIComponent(text);
  }

  function selectPrice(card, optionName, optionPrice) {
    if (selectedPriceCard) {
      selectedPriceCard.classList.remove("is-selected");
      selectedPriceCard.setAttribute("aria-pressed", "false");
    }

    selectedPriceCard = card;
    card.classList.add("is-selected");
    card.setAttribute("aria-pressed", "true");

    if (orderPanel) orderPanel.classList.remove("is-empty");

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

    if (orderPanel) orderPanel.classList.add("is-empty");

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
  setText("[data-product-price]", product.priceFrom || "по запросу");
  setText("[data-product-guarantee]", product.guarantee || "Гарантия после выдачи");

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

  var details = document.querySelector("[data-product-details]");
  if (details) {
    (product.details || [product.description]).forEach(function (detail, index) {
      details.appendChild(createDetailItem(detail, index));
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
  if (clear) clear.addEventListener("click", clearSelection);

  updateMetadata();
})();
