(function () {
  "use strict";

  var config = window.VSTORE_CONFIG || {};
  var products = window.VSTORE_PRODUCTS || [];
  var userAgent = navigator.userAgent || "";
  var isIOS = /iP(hone|ad|od)/i.test(userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var isIOSWebView = isIOS && /AppleWebKit/i.test(userAgent) && !/Safari/i.test(userAgent);
  var isTelegramWebView = /Telegram/i.test(userAgent) || typeof window.TelegramWebviewProxy !== "undefined";

  if (isIOS) {
    document.documentElement.classList.add("is-ios");
  }

  if (isIOSWebView || isTelegramWebView) {
    document.documentElement.classList.add("is-mobile-webview");
  }

  if (isTelegramWebView) {
    document.documentElement.classList.add("is-telegram-webview");
  }

  function applyConfiguredLinks() {
    var links = {
      telegram: config.telegram,
      channel: config.channel,
      reviews: config.reviews
    };

    Object.keys(links).forEach(function (key) {
      if (!links[key]) return;
      document.querySelectorAll("[data-" + key + "]").forEach(function (link) {
        link.href = links[key];
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      });
    });

    var telegramHandle = document.getElementById("telegram-handle");
    if (telegramHandle && config.telegramHandle) {
      telegramHandle.textContent = config.telegramHandle;
    }

    var responseTime = document.getElementById("response-time");
    if (responseTime && config.responseTime) {
      responseTime.textContent = config.responseTime;
    }
  }

  function hydrateFeaturedProducts() {
    document.querySelectorAll("[data-featured-product]").forEach(function (card) {
      var slug = card.getAttribute("data-featured-product");
      var product = products.find(function (item) {
        return item.slug === slug;
      });

      if (!product) {
        card.hidden = true;
        return;
      }

      var image = card.querySelector("img");
      var title = card.querySelector("h3");
      var price = card.querySelector("p");
      var displayTitle = product.featuredTitle || product.title;

      if (image) {
        image.src = product.featuredImage || product.image;
        image.alt = displayTitle;
      }
      if (title) title.textContent = displayTitle;
      if (price) price.textContent = product.priceFrom;
    });
  }

  function initScrollReveal() {
    var targets = document.querySelectorAll(".reveal-group, .reveal");
    targets.forEach(function (target) {
      target.classList.add("is-visible");
    });
  }

  function initParallax() {
    if (
      isTelegramWebView ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(hover: none), (pointer: coarse)").matches
    ) return;
    var orb1 = document.querySelector(".bg-glow__orb--1");
    var orb2 = document.querySelector(".bg-glow__orb--2");
    if (!orb1 || !orb2) return;

    var scrollTicking = false;
    var pointerTicking = false;

    function updateScroll() {
      var y = window.scrollY;
      orb1.style.transform = "translateX(-50%) translateY(" + y * 0.22 + "px)";
      orb2.style.transform = "translateY(" + y * -0.12 + "px)";
      scrollTicking = false;
    }

    window.addEventListener("scroll", function () {
      if (scrollTicking) return;
      scrollTicking = true;
      window.requestAnimationFrame(updateScroll);
    }, { passive: true });

    window.addEventListener("pointermove", function (event) {
      if (pointerTicking) return;
      pointerTicking = true;
      window.requestAnimationFrame(function () {
        var x = (event.clientX / window.innerWidth - 0.5) * 20;
        var y = (event.clientY / window.innerHeight - 0.5) * 20;
        document.documentElement.style.setProperty("--mouse-x", x.toFixed(2) + "px");
        document.documentElement.style.setProperty("--mouse-y", y.toFixed(2) + "px");
        pointerTicking = false;
      });
    }, { passive: true });

    updateScroll();
  }

  function start() {
    var year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();

    applyConfiguredLinks();
    hydrateFeaturedProducts();
    initScrollReveal();
    initParallax();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
