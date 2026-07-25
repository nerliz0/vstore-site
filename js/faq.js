(function () {
  var tabs = Array.prototype.slice.call(document.querySelectorAll("[data-faq-tab]"));
  var items = Array.prototype.slice.call(document.querySelectorAll(".faq-doc__item"));
  var panel = document.querySelector(".faq-doc__panel");
  var search = document.getElementById("faq-search");
  var empty = document.getElementById("faq-empty");
  var activeCategory = "all";
  var animationMs = 300;

  function normalize(value) {
    return value.toLowerCase().trim();
  }

  function escapeHTML(value) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function highlight(value, query) {
    var safe = escapeHTML(value);
    if (!query) return safe;
    return safe.replace(new RegExp("(" + escapeRegExp(query) + ")", "gi"), "<mark>$1</mark>");
  }

  function prepareAnswerWraps() {
    items.forEach(function (item) {
      var answer = item.querySelector("p");
      var wrapper;

      if (!answer) return;

      wrapper = answer.closest(".faq-doc__answer");
      if (!wrapper) {
        wrapper = document.createElement("div");
        wrapper.className = "faq-doc__answer";
        answer.parentNode.insertBefore(wrapper, answer);
        wrapper.appendChild(answer);
      }

      wrapper.style.height = item.open ? "auto" : "0px";
      wrapper.style.opacity = item.open ? "1" : "0";
    });
  }

  function setItemOpen(item, shouldOpen) {
    var answer = item.querySelector(".faq-doc__answer");

    if (!answer) {
      item.open = shouldOpen;
      return;
    }

    if (shouldOpen) {
      if (item.open && answer.style.height === "auto") return;

      item.open = true;
      answer.style.height = "0px";
      answer.style.opacity = "0";

      requestAnimationFrame(function () {
        answer.style.height = answer.scrollHeight + "px";
        answer.style.opacity = "1";
      });

      window.setTimeout(function () {
        if (item.open) answer.style.height = "auto";
      }, animationMs);

      return;
    }

    if (!item.open) return;

    answer.style.height = answer.scrollHeight + "px";
    answer.style.opacity = "1";

    requestAnimationFrame(function () {
      answer.style.height = "0px";
      answer.style.opacity = "0";
    });

    window.setTimeout(function () {
      item.open = false;
    }, animationMs);
  }

  function bindAccordion() {
    items.forEach(function (item) {
      var summary = item.querySelector("summary");
      if (!summary) return;

      summary.addEventListener("click", function (event) {
        event.preventDefault();
        setItemOpen(item, !item.open);
      });
    });
  }

  function cacheItemText() {
    items.forEach(function (item) {
      var summary = item.querySelector("summary");
      var answer = item.querySelector("p");
      item.faqQuestion = summary ? summary.textContent.trim() : "";
      item.faqAnswer = answer ? answer.textContent.trim() : "";
      item.faqText = normalize(item.faqQuestion + " " + item.faqAnswer);
    });
  }

  function updateCounts() {
    var counts = { all: items.length };

    items.forEach(function (item) {
      var category = item.getAttribute("data-category") || "";
      counts[category] = (counts[category] || 0) + 1;
    });

    tabs.forEach(function (tab) {
      var category = tab.getAttribute("data-faq-tab") || "all";
      var count = tab.querySelector(".faq-doc__tab-count");
      if (count) count.textContent = "(" + (counts[category] || 0) + ")";
    });
  }

  function setHighlightedText(query) {
    items.forEach(function (item) {
      var summary = item.querySelector("summary");
      var answer = item.querySelector("p");
      if (summary) summary.innerHTML = highlight(item.faqQuestion, query);
      if (answer) answer.innerHTML = highlight(item.faqAnswer, query);
    });
  }

  function animatePanel() {
    if (!panel) return;
    panel.classList.remove("is-filtering");
    void panel.offsetWidth;
    panel.classList.add("is-filtering");
  }

  function applyFilters() {
    var query = search ? normalize(search.value) : "";
    var visibleItems = [];

    setHighlightedText(query);

    items.forEach(function (item) {
      var category = item.getAttribute("data-category") || "";
      var categoryMatch = activeCategory === "all" || category === activeCategory;
      var queryMatch = !query || item.faqText.indexOf(query) !== -1;
      var visible = categoryMatch && queryMatch;

      item.classList.toggle("is-hidden", !visible);
      if (visible) visibleItems.push(item);
    });

    if (query && visibleItems.length === 1) {
      setItemOpen(visibleItems[0], true);
    }

    if (empty) empty.hidden = !(query && visibleItems.length === 0);
    animatePanel();
  }

  prepareAnswerWraps();
  cacheItemText();
  bindAccordion();
  updateCounts();

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      activeCategory = tab.getAttribute("data-faq-tab") || "all";
      tabs.forEach(function (item) {
        var isActive = item === tab;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });
      applyFilters();
    });
  });

  if (search) {
    search.addEventListener("input", applyFilters);
  }

  applyFilters();
})();
