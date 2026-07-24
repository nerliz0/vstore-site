(function () {
  "use strict";

  var search = document.getElementById("catalog-search");
  var filters = Array.prototype.slice.call(document.querySelectorAll("[data-catalog-filter]"));
  var grid = document.querySelector("[data-catalog-grid]");
  var empty = document.querySelector("[data-catalog-empty]");
  var hero = document.querySelector(".catalog-hero--image");
  var activeFilter = "all";

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
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
      var category = card.getAttribute("data-category") || "";
      var title = normalize(card.getAttribute("data-title") || card.textContent);
      var matchesCategory = activeFilter === "all" || category === activeFilter;
      var matchesQuery = !query || title.indexOf(query) !== -1;
      var visible = matchesCategory && matchesQuery;

      card.hidden = !visible;
      if (!visible) {
        card.classList.remove("is-open");
      }
      if (visible) visibleCount += 1;
    });

    if (empty) {
      empty.classList.toggle("is-hidden", cards.length > 0 && visibleCount > 0);
    }
  }

  function bindCatalogCards() {
    getCards().forEach(function (card) {
      card.addEventListener("click", function () {
        getCards().forEach(function (item) {
          if (item !== card) {
            item.classList.remove("is-open");
          }
        });

        card.classList.toggle("is-open");
      });
    });
  }

  function bindCatalogHeroParallax() {
    if (!hero || !window.matchMedia || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

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

  filters.forEach(function (filter) {
    filter.addEventListener("click", function () {
      activeFilter = filter.getAttribute("data-catalog-filter") || "all";
      filters.forEach(function (item) {
        item.classList.toggle("is-active", item === filter);
      });
      applyFilters();
    });
  });

  if (search) {
    search.addEventListener("input", applyFilters);
  }

  bindCatalogCards();
  bindCatalogHeroParallax();
  applyFilters();
})();
