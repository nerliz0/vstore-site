(function () {
  "use strict";

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
    if (metaDesc) metaDesc.setAttribute("content", VOLTIX_CONFIG.seo.description);

    document.querySelectorAll("[data-telegram]").forEach(function (el) {
      el.href = VOLTIX_CONFIG.telegram;
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    });

    var trustLine = document.getElementById("trust-line");
    if (trustLine && VOLTIX_CONFIG.trustLine) {
      trustLine.textContent = VOLTIX_CONFIG.trustLine;
    }

    var redirectHint = document.getElementById("redirect-hint");
    if (redirectHint && VOLTIX_CONFIG.redirectHint) {
      redirectHint.textContent = VOLTIX_CONFIG.redirectHint;
    }

    var telegramHandle = document.getElementById("telegram-handle");
    if (telegramHandle && VOLTIX_CONFIG.telegramHandle) {
      telegramHandle.textContent = VOLTIX_CONFIG.telegramHandle;
    }

    var responseTime = document.getElementById("response-time");
    if (responseTime && VOLTIX_CONFIG.responseTime) {
      responseTime.textContent = VOLTIX_CONFIG.responseTime;
    }
  }

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

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
    document.querySelectorAll(".product-card.is-expanded").forEach(function (card) {
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
      if (!card.classList.contains("is-expanded")) {
        e.preventDefault();
      }
    });
  }

  function createProductCard(product, group) {
    var parts = getDisplayParts(product);
    var guarantee = product.guarantee || group.defaultGuarantee;
    var orderName = product.name || parts.brand + " " + parts.title;

    var card = document.createElement("article");
    card.className = "product-card";
    card.setAttribute("tabindex", "0");

    /* Preview layer */
    var preview = document.createElement("div");
    preview.className = "product-card__preview";

    if (product.image) {
      var bgImage = document.createElement("img");
      bgImage.className = "product-card__bg";
      bgImage.src = product.image;
      bgImage.alt = "";
      preview.appendChild(bgImage);
    }

    var brand = document.createElement("span");
    brand.className = "product-card__brand";
    brand.textContent = parts.brand.toUpperCase();
    preview.appendChild(brand);

    var titleEl = document.createElement("h4");
    titleEl.className = "product-card__title";
    titleEl.textContent = parts.title;
    preview.appendChild(titleEl);

    var previewFoot = document.createElement("div");
    previewFoot.className = "product-card__preview-foot";

    var price = document.createElement("span");
    price.className = "product-card__price";
    price.textContent = product.price;
    previewFoot.appendChild(price);

    var hint = document.createElement("span");
    hint.className = "product-card__hint";
    hint.setAttribute("aria-hidden", "true");
    hint.textContent = "→";
    previewFoot.appendChild(hint);

    preview.appendChild(previewFoot);
    card.appendChild(preview);

    /* Details layer */
    var details = document.createElement("div");
    details.className = "product-card__details";

    var detailsHead = document.createElement("div");
    detailsHead.className = "product-card__details-head";

    var brandDetail = document.createElement("span");
    brandDetail.className = "product-card__brand";
    brandDetail.textContent = parts.brand.toUpperCase();
    detailsHead.appendChild(brandDetail);

    var summary = document.createElement("p");
    summary.className = "product-card__summary";
    summary.textContent = parts.title + " — " + product.price;
    detailsHead.appendChild(summary);

    details.appendChild(detailsHead);

    var metaList = document.createElement("ul");
    metaList.className = "product-card__meta";

    if (product.note) {
      metaList.appendChild(createDetailLine(product.label || "Срок", product.note));
    }
    if (product.delivery) {
      metaList.appendChild(createDetailLine("Выдача", product.delivery));
    }
    if (guarantee) {
      metaList.appendChild(createDetailLine("Гарантия", guarantee));
    }

    details.appendChild(metaList);

    var buy = document.createElement("a");
    buy.className = "product-card__buy";
    buy.textContent = "Заказать";
    buy.href = buildOrderUrl(orderName, product.note);
    buy.setAttribute("target", "_blank");
    buy.setAttribute("rel", "noopener noreferrer");
    details.appendChild(buy);

    card.appendChild(details);
    bindCardInteraction(card, buy);

    return card;
  }

  function renderPrices() {
    var catalog = document.getElementById("price-catalog");
    if (!catalog || typeof VOLTIX_PRICES === "undefined") return;

    catalog.innerHTML = "";

    VOLTIX_PRICES.groups.forEach(function (group) {
      var groupEl = document.createElement("div");
      groupEl.className = "price-group reveal";

      var groupHead = document.createElement("div");
      groupHead.className = "price-group__head";

      var groupTitle = document.createElement("h3");
      groupTitle.className = "price-group__title";
      groupTitle.textContent = group.name;
      groupHead.appendChild(groupTitle);

      if (group.description) {
        var groupDesc = document.createElement("p");
        groupDesc.className = "price-group__desc";
        groupDesc.textContent = group.description;
        groupHead.appendChild(groupDesc);
      }

      if (group.tagline) {
        var groupTag = document.createElement("p");
        groupTag.className = "price-group__tagline";
        groupTag.textContent = group.tagline;
        groupHead.appendChild(groupTag);
      }

      groupEl.appendChild(groupHead);

      var grid = document.createElement("div");
      grid.className = "price-group__grid";

      group.products.forEach(function (product) {
        grid.appendChild(createProductCard(product, group));
      });

      groupEl.appendChild(grid);
      catalog.appendChild(groupEl);
    });

    if (touchDevice) {
      document.addEventListener("click", function (e) {
        if (!e.target.closest(".product-card")) {
          closeAllCards(null);
        }
      });
    }

    observeScrollAnimations();
  }

  var scrollObserver;

  function observeScrollAnimations() {
    if (scrollObserver) scrollObserver.disconnect();

    var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var targets = document.querySelectorAll(".reveal-group:not(.reveal-group--hero), .reveal");

    // Если включено уменьшение движения – просто показываем всё без анимации
    if (prefersReduced) {
      targets.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    // Создаём observer
    scrollObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            scrollObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -35% 0px"
      }
    );

    // Проверяем, какие элементы уже видны при загрузке
    targets.forEach(function (target) {
      var rect = target.getBoundingClientRect();
      var windowHeight = window.innerHeight;
      // Учитываем rootMargin: верхняя граница 0, нижняя = windowHeight * (1 + 0.35)
      var visibleTop = 0;
      var visibleBottom = windowHeight * 1.35;
      if (rect.bottom > visibleTop && rect.top < visibleBottom) {
        // Элемент виден – сразу показываем
        target.classList.add("is-visible");
      } else {
        // Иначе начинаем следить
        scrollObserver.observe(target);
      }
    });
  }

  function initHeroAnimation() {
    var hero = document.querySelector(".reveal-group--hero");
    if (!hero) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      hero.classList.add("is-visible");
      return;
    }

    requestAnimationFrame(function () {
      hero.classList.add("is-visible");
    });
  }

  function initParallax() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var orb1 = document.querySelector(".bg-glow__orb--1");
    var orb2 = document.querySelector(".bg-glow__orb--2");
    if (!orb1 || !orb2) return;

    var ticking = false;

    function updateParallax() {
      var y = window.scrollY;
      orb1.style.transform =
        "translateX(-50%) translateY(" + y * 0.22 + "px)";
      orb2.style.transform = "translateY(" + y * -0.12 + "px)";
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          requestAnimationFrame(updateParallax);
          ticking = true;
        }
      },
      { passive: true }
    );

    updateParallax();
  }

  // Запускаем отрисовку каталога, а затем анимации
  renderPrices();
  initHeroAnimation();
  initParallax();
})();
