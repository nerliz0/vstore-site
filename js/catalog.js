(function () {
  "use strict";

  var products = window.VSTORE_PRODUCTS || [];
  var search = document.getElementById("catalog-search");
  var filters = Array.prototype.slice.call(document.querySelectorAll("[data-catalog-filter]"));
  var grid = document.querySelector("[data-catalog-grid]");
  var empty = document.querySelector("[data-catalog-empty]");
  var resultStatus = document.querySelector("[data-catalog-status]");
  var hero = document.querySelector(".catalog-hero--image");
  var activeFilter = "all";

  function normalize(value) {
    return String(value || "")
      .toLocaleLowerCase("ru-RU")
      .replace(/ё/g, "е")
      .replace(/[^\p{L}\p{N}]+/gu, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function getProductSearchText(product) {
    var values = [
      product.title,
      product.featuredTitle,
      product.category,
      product.slug,
      product.description
    ]
      .concat(product.items || [])
      .concat(product.aliases || [])
      .concat(product.filters || []);

    if (Array.isArray(product.prices)) {
      product.prices.forEach(function (group) {
        values.push(group.title);
        (group.rows || []).forEach(function (row) {
          values.push(row[0]);
        });
      });
    }

    return normalize(values.join(" "));
  }

  function createItems(items) {
    var fragment = document.createDocumentFragment();

    items.forEach(function (item, index) {
      fragment.appendChild(document.createTextNode(item));
      if (index < items.length - 1) {
        var separator = document.createElement("em");
        separator.setAttribute("aria-hidden", "true");
        fragment.appendChild(separator);
      }
    });

    return fragment;
  }

  function createCatalogCard(product) {
    var card = document.createElement("a");
    var media = document.createElement("span");
    var image = document.createElement("img");
    var body = document.createElement("span");
    var title = document.createElement("span");
    var items = document.createElement("span");
    var price = document.createElement("span");
    var action = document.createElement("span");
    var arrow = document.createElement("i");

    card.className = "catalog-card";
    card.href = "product.html?item=" + encodeURIComponent(product.slug);
    card.dataset.catalogCard = "";
    card.dataset.categories = product.filters.join(" ");
    card.dataset.search = getProductSearchText(product);

    media.className = "catalog-card__media";
    image.src = product.image;
    image.alt = product.title;
    image.loading = "lazy";
    image.decoding = "async";
    media.appendChild(image);

    body.className = "catalog-card__body";
    title.className = "catalog-card__title";
    title.textContent = product.title;
    items.className = "catalog-card__items";
    items.appendChild(createItems(product.items));
    price.className = "catalog-card__price";
    price.textContent = product.priceFrom;
    action.className = "catalog-card__action";
    action.appendChild(document.createTextNode("Открыть "));
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "→";
    action.appendChild(arrow);

    body.appendChild(title);
    body.appendChild(items);
    body.appendChild(price);
    body.appendChild(action);
    card.appendChild(media);
    card.appendChild(body);
    return card;
  }

  function renderCatalog() {
    if (!grid) return;
    grid.replaceChildren();

    var fragment = document.createDocumentFragment();
    products.forEach(function (product) {
      fragment.appendChild(createCatalogCard(product));
    });
    grid.appendChild(fragment);
  }

  function getCards() {
    if (!grid) return [];
    return Array.prototype.slice.call(grid.querySelectorAll("[data-catalog-card]"));
  }

  function applyFilters() {
    var query = normalize(search ? search.value : "");
    var cards = getCards();
    var visibleCount = 0;

    cards.forEach(function (card) {
      var categories = (card.dataset.categories || "").split(" ");
      var searchText = card.dataset.search || "";
      var matchesCategory = activeFilter === "all" || categories.indexOf(activeFilter) !== -1;
      var matchesQuery = !query || searchText.indexOf(query) !== -1;
      var visible = matchesCategory && matchesQuery;

      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    if (empty) empty.classList.toggle("is-hidden", visibleCount > 0);
    if (resultStatus) {
      resultStatus.textContent = visibleCount
        ? "Найдено товаров: " + visibleCount
        : "Товары не найдены";
    }
  }

  function setActiveFilter(filter) {
    activeFilter = filter.getAttribute("data-catalog-filter") || "all";
    filters.forEach(function (item) {
      var isActive = item === filter;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
    applyFilters();
  }

  function bindCatalogHeroParallax() {
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    hero.addEventListener("mousemove", function (event) {
      var rect = hero.getBoundingClientRect();
      var x = (event.clientX - rect.left) / rect.width - 0.5;
      var y = (event.clientY - rect.top) / rect.height - 0.5;
      hero.style.setProperty("--hero-x", (x * 12).toFixed(2) + "px");
      hero.style.setProperty("--hero-y", (y * 10).toFixed(2) + "px");
    });

    hero.addEventListener("mouseleave", function () {
      hero.style.setProperty("--hero-x", "0px");
      hero.style.setProperty("--hero-y", "0px");
    });
  }

  renderCatalog();

  filters.forEach(function (filter) {
    filter.addEventListener("click", function () {
      setActiveFilter(filter);
    });
  });

  if (search) search.addEventListener("input", applyFilters);

  bindCatalogHeroParallax();
  applyFilters();
})();
