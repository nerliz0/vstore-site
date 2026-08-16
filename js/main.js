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
      support: config.support,
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

  function initSupportWidget() {
    if (document.querySelector("[data-support-widget]")) return;

    var supportUrl = config.support || "https://t.me/VstoreSupportBot";
    var supportHandle = config.supportHandle || "@VstoreSupportBot";
    var widget = document.createElement("div");
    widget.className = "support-widget";
    widget.setAttribute("data-support-widget", "");
    widget.innerHTML =
      '<button class="support-widget__trigger" type="button" aria-label="Открыть поддержку" aria-haspopup="dialog" aria-expanded="false" data-support-open>' +
        '<img src="assets/footer/final-icon-support.png" alt="" width="340" height="340" decoding="async" />' +
        '<span class="support-widget__status" aria-hidden="true"></span>' +
      '</button>' +
      '<div class="support-modal" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="support-modal-title" data-support-modal>' +
        '<button class="support-modal__backdrop" type="button" tabindex="-1" aria-hidden="true" data-support-close></button>' +
        '<div class="support-modal__dialog">' +
          '<button class="support-modal__close" type="button" aria-label="Закрыть" data-support-close>×</button>' +
          '<div class="support-modal__brand" aria-hidden="true">' +
            '<img src="assets/footer/final-icon-support.png" alt="" width="340" height="340" decoding="async" />' +
          '</div>' +
          '<p class="support-modal__eyebrow">Vstore Support</p>' +
          '<h2 id="support-modal-title">Нужна помощь?</h2>' +
          '<p class="support-modal__lead">Выберите удобный способ быстро найти ответ.</p>' +
          '<div class="support-modal__choices">' +
            '<a class="support-modal__choice" href="faq.html" data-support-faq>' +
              '<span class="support-modal__choice-icon" aria-hidden="true">?</span>' +
              '<span><strong>Ознакомиться с FAQ</strong><small>Оплата, заказы, гарантии и аккаунты</small></span>' +
              '<i aria-hidden="true">→</i>' +
            '</a>' +
            '<a class="support-modal__choice support-modal__choice--primary" href="' + supportUrl + '" target="_blank" rel="noopener noreferrer">' +
              '<span class="support-modal__choice-icon" aria-hidden="true">•••</span>' +
              '<span><strong>Написать в поддержку</strong><small>' + supportHandle + '</small></span>' +
              '<i aria-hidden="true">→</i>' +
            '</a>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(widget);

    var trigger = widget.querySelector("[data-support-open]");
    var modal = widget.querySelector("[data-support-modal]");
    var closeButtons = widget.querySelectorAll("[data-support-close]");
    var faqLink = widget.querySelector("[data-support-faq]");
    var lastFocused = null;

    function getFocusableElements() {
      return Array.prototype.slice.call(modal.querySelectorAll(".support-modal__close, a[href]"));
    }

    function openModal() {
      lastFocused = document.activeElement;
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      trigger.setAttribute("aria-expanded", "true");
      document.body.classList.add("support-modal-open");

      var focusable = getFocusableElements();
      if (focusable.length) focusable[0].focus();
    }

    function closeModal(restoreFocus) {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      trigger.setAttribute("aria-expanded", "false");
      document.body.classList.remove("support-modal-open");

      if (restoreFocus !== false && lastFocused && typeof lastFocused.focus === "function") {
        lastFocused.focus();
      }
    }

    trigger.addEventListener("click", openModal);
    closeButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        closeModal(true);
      });
    });
    if (faqLink) {
      faqLink.addEventListener("click", function () {
        closeModal(false);
      });
    }

    document.addEventListener("keydown", function (event) {
      if (!modal.classList.contains("is-open")) return;

      if (event.key === "Escape") {
        event.preventDefault();
        closeModal(true);
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
      var mobileSource = card.querySelector("source[media]");
      var title = card.querySelector("h3");
      var price = card.querySelector("p");
      var displayTitle = product.featuredTitle || product.title;

      if (image) {
        image.src = product.featuredImage || product.image;
        image.alt = displayTitle;
      }
      if (mobileSource && product.featuredMobileImage) {
        mobileSource.srcset = product.featuredMobileImage;
      }
      if (title) title.textContent = displayTitle;
      if (price) price.textContent = product.priceFrom;
    });
  }

  function initScrollReveal() {
    var targets = Array.prototype.slice.call(document.querySelectorAll(".reveal-group, .reveal"));
    if (!targets.length) return;

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      targets.forEach(function (target) {
        target.classList.add("is-visible");
      });
      return;
    }

    var observer = null;
    var ticking = false;

    function reveal(target) {
      if (target.classList.contains("is-visible")) return;
      target.classList.add("is-visible");
      if (observer) observer.unobserve(target);
      window.setTimeout(function () {
        target.classList.remove("is-reveal-pending");
      }, 1100);
    }

    function isInsideRevealZone(target) {
      var rect = target.getBoundingClientRect();
      var viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      // Content restored above the viewport must stay readable after back/forward navigation.
      if (rect.bottom <= 0) return true;
      return rect.top <= viewportHeight * 0.78 && rect.bottom >= 0;
    }

    function checkVisibility() {
      targets.forEach(function (target) {
        if (isInsideRevealZone(target)) reveal(target);
      });
      ticking = false;
    }

    targets.forEach(function (target) {
      if (isInsideRevealZone(target)) {
        target.classList.add("is-visible");
      } else {
        target.classList.add("is-reveal-pending");
      }
    });

    if ("IntersectionObserver" in window) {
      try {
        observer = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) reveal(entry.target);
          });
        }, {
          root: null,
          rootMargin: "0px 0px -22% 0px",
          threshold: 0.01
        });

        targets.forEach(function (target) {
          if (!target.classList.contains("is-visible")) observer.observe(target);
        });
      } catch (error) {
        observer = null;
      }
    }

    function requestCheck() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(checkVisibility);
    }

    window.addEventListener("scroll", requestCheck, { passive: true });
    window.addEventListener("resize", requestCheck, { passive: true });
    window.addEventListener("pageshow", requestCheck, { passive: true });
    window.setTimeout(requestCheck, 250);
    window.setTimeout(requestCheck, 1000);
  }

  function initHeroIntro() {
    var hero = document.querySelector(".hero__inner");
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document.body.classList.add("hero-intro-pending");

    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        document.body.classList.add("hero-intro-active");
      });
    });

    window.setTimeout(function () {
      document.body.classList.remove("hero-intro-pending", "hero-intro-active");
    }, 1900);
  }

  function normalizePath(pathname) {
    return pathname.replace(/\/(?:index\.html)?$/, "/");
  }

  function initCurrentPageScroll() {
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.addEventListener("click", function (event) {
      var link = event.target.closest("a[href]");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

      var linkUrl;
      try {
        linkUrl = new URL(link.getAttribute("href"), window.location.href);
      } catch (error) {
        return;
      }

      var sameOrigin = linkUrl.origin === window.location.origin;
      var samePath = normalizePath(linkUrl.pathname) === normalizePath(window.location.pathname);
      var sameSearch = linkUrl.search === window.location.search || linkUrl.search === "";
      if (!sameOrigin || !samePath || !sameSearch) return;

      event.preventDefault();
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: reduceMotion ? "auto" : "smooth"
      });

      if (linkUrl.hash && window.history && window.history.replaceState) {
        window.history.replaceState(null, "", linkUrl.pathname + linkUrl.search);
      }
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
    Promise.resolve(window.VSTORE_PRODUCTS_READY || products).then(function () {
      products = window.VSTORE_PRODUCTS || products;
      hydrateFeaturedProducts();
    }).catch(hydrateFeaturedProducts);
    initHeroIntro();
    initSupportWidget();
    initScrollReveal();
    initCurrentPageScroll();
    initParallax();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
