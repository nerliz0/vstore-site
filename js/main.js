(function () {
  "use strict";

  // --- Конфигурация и ссылки (оставляем как есть) ---
  var touchDevice = window.matchMedia("(hover: none)").matches;

  function buildOrderUrl(productName, note) {
    if (typeof VOLTIX_CONFIG === "undefined") return "#";
    var prefix = VOLTIX_CONFIG.orderPrefix || "Хочу заказать";
    var text = prefix + " " + productName;
    if (note) text += " (" + note + ")";
    var base = VOLTIX_CONFIG.telegram.replace(/\/?$/, "");
    return base + "?text=" + encodeURIComponent(text);
  }

  if (typeof VOLTIX_CONFIG !== "undefined") {
    document.title = VOLTIX_CONFIG.seo.title;
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc)
      metaDesc.setAttribute("content", VOLTIX_CONFIG.seo.description);
    document.querySelectorAll("[data-telegram]").forEach(function (el) {
      el.href = VOLTIX_CONFIG.telegram;
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    });
    var telegramHandle = document.getElementById("telegram-handle");
    if (telegramHandle && VOLTIX_CONFIG.telegramHandle)
      telegramHandle.textContent = VOLTIX_CONFIG.telegramHandle;
    var responseTime = document.getElementById("response-time");
    if (responseTime && VOLTIX_CONFIG.responseTime)
      responseTime.textContent = VOLTIX_CONFIG.responseTime;
  }

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // --- Карточки товаров (без изменений) ---
  function getDisplayParts(product) {
    var brand = product.brand || "";
    var title = product.title || product.name || "";
    if (!brand && product.name) {
      var parts = product.name.split(" ");
      brand = parts[0];
      title = parts.slice(1).join(" ") || product.name;
    }
    return { brand: brand, title: title };
  }

  function createDetailLine(label, value) {
    var li = document.createElement("li");
    li.className = "product-card__detail";
    li.innerHTML =
      '<span class="product-card__detail-label">' +
      label +
      '</span><span class="product-card__detail-value">' +
      value +
      "</span>";
    return li;
  }

  function closeAllCards(except) {
    document
      .querySelectorAll(".product-card.is-expanded")
      .forEach(function (card) {
        if (card !== except) card.classList.remove("is-expanded");
      });
  }

  function bindCardInteraction(card, buyBtn) {
    if (!touchDevice) return;

    card.addEventListener("click", function (e) {
      if (e.target.closest(".product-card__buy")) {
        if (!card.classList.contains("is-expanded")) {
          e.preventDefault();
          closeAllCards(card);
          card.classList.add("is-expanded");
        }
        return;
      }
      closeAllCards(card);
      card.classList.toggle("is-expanded");
    });
    buyBtn.addEventListener("click", function (e) {
      if (!card.classList.contains("is-expanded")) e.preventDefault();
    });
  }

  function createProductCard(product, group) {
    var parts = getDisplayParts(product);
    var guarantee = product.guarantee || group.defaultGuarantee;
    var orderName = product.name || parts.brand + " " + parts.title;

    var card = document.createElement("article");
    card.className = "product-card reveal-item";
    card.setAttribute("tabindex", "0");

    if (product.image) {
      var bgImage = document.createElement("img");
      bgImage.className = "product-card__bg";
      bgImage.src = product.image;
      bgImage.alt = "";
      card.appendChild(bgImage);
    }

    var content = document.createElement("div");
    content.className = "product-card__content";

    var brand = document.createElement("span");
    brand.className = "product-card__brand";
    brand.textContent = parts.brand.toUpperCase();
    content.appendChild(brand);

    var titleEl = document.createElement("h4");
    titleEl.className = "product-card__title";
    titleEl.textContent = parts.title;
    content.appendChild(titleEl);

    var foot = document.createElement("div");
    foot.className = "product-card__foot";
    var price = document.createElement("span");
    price.className = "product-card__price";
    price.textContent = product.price;
    foot.appendChild(price);
    var hint = document.createElement("span");
    hint.className = "product-card__hint";
    hint.setAttribute("aria-hidden", "true");
    hint.textContent = "→";
    foot.appendChild(hint);
    content.appendChild(foot);

    var more = document.createElement("div");
    more.className = "product-card__more";
    var moreInner = document.createElement("div");
    moreInner.className = "product-card__more-inner";

    var metaList = document.createElement("ul");
    metaList.className = "product-card__meta";
    if (product.note)
      metaList.appendChild(
        createDetailLine(product.label || "Срок", product.note),
      );
    if (product.delivery)
      metaList.appendChild(createDetailLine("Выдача", product.delivery));
    if (guarantee)
      metaList.appendChild(createDetailLine("Гарантия", guarantee));
    moreInner.appendChild(metaList);

    var buy = document.createElement("a");
    buy.className = "product-card__buy";
    buy.textContent = "Заказать";
    buy.href = buildOrderUrl(orderName, product.note);
    buy.setAttribute("target", "_blank");
    buy.setAttribute("rel", "noopener noreferrer");
    moreInner.appendChild(buy);
    more.appendChild(moreInner);
    content.appendChild(more);

    card.appendChild(content);
    bindCardInteraction(card, buy);
    return card;
  }

  function parsePriceValue(price) {
    if (!price) return Infinity;
    var digits = String(price).replace(/[^\d]/g, "");
    return digits ? parseInt(digits, 10) : Infinity;
  }

  function formatPriceFrom(value) {
    if (!isFinite(value)) return "";
    return "от " + value.toLocaleString("ru-RU") + " ₽";
  }

  function groupProductsByBrand(products) {
    var map = {};
    var order = [];
    products.forEach(function (product) {
      var brand = product.brand || "Другое";
      if (!map[brand]) {
        map[brand] = [];
        order.push(brand);
      }
      map[brand].push(product);
    });
    return order.map(function (brand) {
      return { brand: brand, products: map[brand] };
    });
  }

  function getBrandMeta(brand, products) {
    var meta =
      (VOLTIX_PRICES.brandMeta && VOLTIX_PRICES.brandMeta[brand]) || {};
    var image = meta.image;
    if (!image && products.length) image = products[0].image;
    return {
      image: image || "",
      gradient:
        meta.gradient ||
        "linear-gradient(145deg, rgba(139, 92, 246, 0.35) 0%, rgba(20, 20, 28, 1) 100%)",
    };
  }

  function getMinPrice(products) {
    return products.reduce(function (min, product) {
      var value = parsePriceValue(product.price);
      return value < min ? value : min;
    }, Infinity);
  }

  function createCategoryCard(brandEntry, group, onOpen) {
    var brand = brandEntry.brand;
    var products = brandEntry.products;
    var meta = getBrandMeta(brand, products);
    var minPrice = getMinPrice(products);

    var card = document.createElement("article");
    card.className = "category-card reveal-item";
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", "Открыть категорию " + brand);

    var visual = document.createElement("div");
    visual.className = "category-card__visual";
    visual.style.background = meta.gradient;
    if (meta.image) {
      var logo = document.createElement("img");
      logo.className = "category-card__logo";
      logo.src = meta.image;
      logo.alt = brand;
      visual.appendChild(logo);
    }
    card.appendChild(visual);

    var body = document.createElement("div");
    body.className = "category-card__body";
    var name = document.createElement("h4");
    name.className = "category-card__name";
    name.textContent = brand;
    body.appendChild(name);

    var price = document.createElement("p");
    price.className = "category-card__price";
    price.textContent = formatPriceFrom(minPrice);
    body.appendChild(price);

    var count = document.createElement("p");
    count.className = "category-card__count";
    count.textContent =
      products.length +
      " " +
      (products.length === 1
        ? "товар"
        : products.length < 5
          ? "товара"
          : "товаров");
    body.appendChild(count);

    var btn = document.createElement("span");
    btn.className = "category-card__btn";
    btn.textContent = "Смотреть";
    body.appendChild(btn);
    card.appendChild(body);

    function openCategory() {
      if (typeof onOpen === "function") onOpen(brandEntry);
    }

    card.addEventListener("click", openCategory);
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openCategory();
      }
    });

    return card;
  }

  function showCategoryView(groupEl) {
    var categoriesPanel = groupEl.querySelector(".price-group__categories");
    var productsPanel = groupEl.querySelector(".price-group__products");
    if (!categoriesPanel || !productsPanel) return;
    productsPanel.classList.remove("is-active");
    productsPanel.innerHTML = "";
    categoriesPanel.hidden = false;
    groupEl.classList.remove("price-group--expanded");
  }

  function showProductsView(groupEl, brandEntry, group) {
    var categoriesPanel = groupEl.querySelector(".price-group__categories");
    var productsPanel = groupEl.querySelector(".price-group__products");
    if (!categoriesPanel || !productsPanel) return;

    categoriesPanel.hidden = true;
    productsPanel.innerHTML = "";
    productsPanel.classList.add("is-active");
    groupEl.classList.add("price-group--expanded");

    var toolbar = document.createElement("div");
    toolbar.className = "price-group__toolbar reveal-item";

    var backBtn = document.createElement("button");
    backBtn.type = "button";
    backBtn.className = "price-group__back";
    backBtn.textContent = "← Назад";
    backBtn.addEventListener("click", function () {
      showCategoryView(groupEl);
      groupEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
    toolbar.appendChild(backBtn);

    var heading = document.createElement("h4");
    heading.className = "price-group__subheading";
    heading.textContent = brandEntry.brand;
    toolbar.appendChild(heading);
    productsPanel.appendChild(toolbar);

    var grid = document.createElement("div");
    grid.className = "price-group__grid";
    brandEntry.products.forEach(function (product) {
      grid.appendChild(createProductCard(product, group));
    });
    productsPanel.appendChild(grid);

    requestAnimationFrame(function () {
      productsPanel.querySelectorAll(".reveal-item").forEach(function (el) {
        el.classList.add("is-visible");
      });
    });
  }

  // Scroll reveal: sections appear only after they reach the active viewport zone.
  var revealTargets = [];
  var revealScrollBound = false;

  function collectRevealTargets() {
    revealTargets = [];
    var groups = document.querySelectorAll(
      ".reveal-group:not(.reveal-group--hero), .reveal",
    );
    groups.forEach(function (el) {
      revealTargets.push(el);
    });
  }

  function checkVisibility() {
    if (revealTargets.length === 0) return;
    var windowHeight = window.innerHeight;
    var triggerLine = windowHeight * 0.58;
    var topGuard = windowHeight * 0.08;

    revealTargets.forEach(function (el) {
      if (el.classList.contains("is-visible")) return;
      var rect = el.getBoundingClientRect();
      if (rect.top < triggerLine && rect.bottom > topGuard) {
        el.classList.add("is-visible");
      }
    });
  }

  function initScrollReveal() {
    collectRevealTargets();

    if (revealScrollBound) {
      checkVisibility();
      return;
    }

    revealScrollBound = true;
    checkVisibility();
    // При скролле
    var ticking = false;
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(function () {
            checkVisibility();
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true },
    );
    // При изменении размера окна
    window.addEventListener("resize", checkVisibility, { passive: true });
  }

  // --- Параллакс ---
  function initParallax() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var orb1 = document.querySelector(".bg-glow__orb--1");
    var orb2 = document.querySelector(".bg-glow__orb--2");
    if (!orb1 || !orb2) return;
    var ticking = false;
    var pointerTicking = false;
    function updateParallax() {
      var y = window.scrollY;
      orb1.style.transform = "translateX(-50%) translateY(" + y * 0.22 + "px)";
      orb2.style.transform = "translateY(" + y * -0.12 + "px)";
      ticking = false;
    }
    function updatePointerParallax(event) {
      if (pointerTicking) return;
      pointerTicking = true;
      requestAnimationFrame(function () {
        var x = ((event.clientX / window.innerWidth) - 0.5) * 20;
        var y = ((event.clientY / window.innerHeight) - 0.5) * 20;
        document.documentElement.style.setProperty("--mouse-x", x.toFixed(2) + "px");
        document.documentElement.style.setProperty("--mouse-y", y.toFixed(2) + "px");
        pointerTicking = false;
      });
    }
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          requestAnimationFrame(updateParallax);
          ticking = true;
        }
      },
      { passive: true },
    );
    window.addEventListener("pointermove", updatePointerParallax, { passive: true });
    updateParallax();
  }

  // --- Герой ---
  function initHero() {
    var hero = document.querySelector(".reveal-group--hero");
    if (hero) {
      requestAnimationFrame(function () {
        hero.classList.add("is-visible");
      });
    }
  }

  // --- Запуск ---
  function start() {
    initHero();
    initParallax();
    // Запускаем скролл-ревил после загрузки основных блоков
    setTimeout(initScrollReveal, 200);
    // И ещё раз через 500 мс, чтобы перехватить все элементы
    setTimeout(initScrollReveal, 500);
  }

  if (document.readyState === "complete") {
    start();
  } else {
    window.addEventListener("load", start);
  }
})();
