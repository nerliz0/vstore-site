(function () {
  "use strict";

  var RATE = 1.04;
  var COMMISSION_PERCENT = 4;
  var MIN_AMOUNT = 300;
  var QUICK_AMOUNTS = [500, 1000, 1500, 2000];
  var LOGIN_HELP_IMAGE = "assets/catalog/62f7ed6d-ac6b-42cd-a75f-c5caf8019699.png";
  var products = window.VSTORE_PRODUCTS || [];
  var steamProduct = products.find(function (product) {
    return product.slug === "steam";
  }) || {
    slug: "steam",
    title: "Steam",
    image: "assets/catalog/steam-vstore-224x165.png"
  };

  function formatPrice(value) {
    return new Intl.NumberFormat("ru-RU").format(Math.round(value)) + " ₽";
  }

  function formatNumber(value) {
    return new Intl.NumberFormat("ru-RU").format(Math.round(value));
  }

  function parseAmount(input) {
    var value = Number(String(input.value || "").replace(/[^0-9]/g, ""));
    if (!Number.isFinite(value)) return 0;
    return Math.floor(value);
  }

  function getTotal(amount) {
    return Math.round(amount * RATE);
  }

  function shouldShow(root) {
    if (root.dataset.steamContext !== "product") return true;
    var params = new URLSearchParams(window.location.search);
    return (params.get("item") || "fortnite") === "steam";
  }

  function createMarkup() {
    return '' +
      '<div class="steam-topup__panel">' +
        '<div class="steam-topup__services" aria-label="Пополнение сервисов">' +
          '<p>Пополнение сервисов</p>' +
          '<div class="steam-topup__service-list">' +
            '<span class="steam-topup__service is-active"><img src="' + steamProduct.image + '" alt="" width="224" height="165" loading="lazy" decoding="async" /><strong>Steam</strong></span>' +
            '<span class="steam-topup__service"><img src="assets/catalog/playstation-vstore-224x165.png" alt="" width="224" height="165" loading="lazy" decoding="async" /><strong>PlayStation</strong></span>' +
            '<span class="steam-topup__service"><img src="assets/catalog/telegram-vstore-224x165.png" alt="" width="224" height="165" loading="lazy" decoding="async" /><strong>Telegram</strong></span>' +
            '<span class="steam-topup__service"><img src="assets/catalog/apple-app-store-vstore-224x165.png" alt="" width="224" height="165" loading="lazy" decoding="async" /><strong>Apple</strong></span>' +
          '</div>' +
        '</div>' +
        '<div class="steam-topup__form">' +
          '<label class="steam-topup__field">' +
            '<span>Получите</span>' +
            '<input data-steam-amount type="number" min="' + MIN_AMOUNT + '" step="1" inputmode="numeric" value="500" aria-describedby="steam-topup-status" />' +
          '</label>' +
          '<div class="steam-topup__currency" aria-label="Регион и валюта">' +
            '<strong>RU, ₽</strong>' +
            '<span aria-hidden="true">⌄</span>' +
          '</div>' +
          '<div class="steam-topup__login-block">' +
            '<label class="steam-topup__field steam-topup__field--login">' +
              '<span>Логин Steam</span>' +
              '<input data-steam-login type="text" placeholder="Логин Steam" autocomplete="off" />' +
            '</label>' +
            '<button class="steam-topup__help" type="button" aria-haspopup="dialog" aria-expanded="false" data-steam-help>Как узнать логин?</button>' +
          '</div>' +
          '<button class="steam-topup__button" type="button" data-steam-add>Купить за 520 ₽</button>' +
        '</div>' +
        '<div class="steam-topup__quick" aria-label="Быстрые суммы">' +
          QUICK_AMOUNTS.map(function (amount) {
            return '<button type="button" data-steam-quick="' + amount + '">' + formatNumber(amount) + ' ₽</button>';
          }).join("") +
        '</div>' +
        '<p class="steam-topup__status" id="steam-topup-status" data-steam-status aria-live="polite"></p>' +
        '<p class="steam-topup__summary-line">Минимум ' + formatPrice(MIN_AMOUNT) + ' · комиссия ' + COMMISSION_PERCENT + '% · пример: 500 ₽ × 1.04 = 520 ₽ · итог может отличаться на ±5 ₽ после проверки.</p>' +
      '</div>' +
      '<div class="steam-login-modal" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="steam-login-modal-title" data-steam-login-modal>' +
        '<button class="steam-login-modal__backdrop" type="button" tabindex="-1" aria-hidden="true" data-steam-help-close></button>' +
        '<div class="steam-login-modal__dialog">' +
          '<button class="steam-login-modal__close" type="button" aria-label="Закрыть" data-steam-help-close>×</button>' +
          '<h2 id="steam-login-modal-title">Как узнать свой логин Steam?</h2>' +
          '<p class="steam-login-modal__lead">Логин Steam — это то, что вы вводите для входа в аккаунт. Его можно посмотреть на странице аккаунта Steam.</p>' +
          '<img class="steam-login-modal__image" src="' + LOGIN_HELP_IMAGE + '" alt="Пример страницы аккаунта Steam с логином Vstore Account" width="1672" height="941" loading="lazy" decoding="async" />' +
          '<p class="steam-login-modal__warning">Будьте внимательны: если указать неправильный логин, пополнение может уйти другому пользователю.</p>' +
          '<button class="steam-login-modal__ok" type="button" data-steam-help-close>Понятно</button>' +
        '</div>' +
      '</div>';
  }

  function initTopup(root) {
    if (!shouldShow(root)) {
      root.hidden = true;
      return;
    }

    root.innerHTML = createMarkup();
    root.hidden = false;
    if (root.dataset.steamContext === "product") {
      document.body.classList.add("is-steam-product");
    }

    var amountInput = root.querySelector("[data-steam-amount]");
    var loginInput = root.querySelector("[data-steam-login]");
    var addButton = root.querySelector("[data-steam-add]");
    var helpButton = root.querySelector("[data-steam-help]");
    var helpModal = root.querySelector("[data-steam-login-modal]");
    var helpCloseButtons = root.querySelectorAll("[data-steam-help-close]");
    var status = root.querySelector("[data-steam-status]");
    var helpLastFocus = null;

    function focusElement(element) {
      if (!element || typeof element.focus !== "function") return;
      try {
        element.focus({ preventScroll: true });
      } catch (error) {
        element.focus();
      }
    }

    function update() {
      var amount = parseAmount(amountInput);
      var validAmount = amount >= MIN_AMOUNT;
      var calculatedAmount = validAmount ? amount : MIN_AMOUNT;
      var calculatedTotal = getTotal(calculatedAmount);
      var hasLogin = Boolean(String(loginInput.value || "").trim());

      addButton.textContent = validAmount ? "Купить за " + formatPrice(calculatedTotal) : "Минимум " + formatPrice(MIN_AMOUNT);
      addButton.disabled = !validAmount;

      if (!validAmount) {
        status.textContent = "Минимальная сумма пополнения — " + formatPrice(MIN_AMOUNT) + ".";
      } else if (!hasLogin) {
        status.textContent = "Укажите логин Steam, чтобы добавить пополнение в корзину.";
      } else {
        status.textContent = "К оплате: " + formatPrice(calculatedTotal) + ". На баланс Steam: " + formatPrice(calculatedAmount) + ".";
      }
    }

    amountInput.addEventListener("input", update);
    loginInput.addEventListener("input", update);

    root.querySelectorAll("[data-steam-quick]").forEach(function (button) {
      button.addEventListener("click", function () {
        amountInput.value = button.dataset.steamQuick;
        update();
      });
    });

    function openHelpModal() {
      if (!helpModal) return;
      helpLastFocus = document.activeElement;
      helpModal.classList.add("is-open");
      helpModal.setAttribute("aria-hidden", "false");
      helpButton.setAttribute("aria-expanded", "true");
      document.body.classList.add("steam-login-modal-open");

      var closeButton = helpModal.querySelector(".steam-login-modal__close");
      focusElement(closeButton);
    }

    function closeHelpModal() {
      if (!helpModal) return;
      helpModal.classList.remove("is-open");
      helpModal.setAttribute("aria-hidden", "true");
      helpButton.setAttribute("aria-expanded", "false");
      document.body.classList.remove("steam-login-modal-open");
      if (helpLastFocus && typeof helpLastFocus.focus === "function") {
        focusElement(helpLastFocus);
      }
      helpLastFocus = null;
    }

    if (helpButton && helpModal) {
      helpButton.addEventListener("click", openHelpModal);
      helpCloseButtons.forEach(function (button) {
        button.addEventListener("click", closeHelpModal);
      });
      document.addEventListener("keydown", function (event) {
        if (event.key !== "Escape" || !helpModal.classList.contains("is-open")) return;
        closeHelpModal();
      });
    }

    addButton.addEventListener("click", function () {
      var amount = parseAmount(amountInput);
      var login = String(loginInput.value || "").trim();
      if (amount < MIN_AMOUNT || !login || !window.VSTORE_CART) {
        update();
        return;
      }

      var totalValue = getTotal(amount);
      var added = window.VSTORE_CART.add({
        slug: steamProduct.slug,
        title: steamProduct.title,
        image: steamProduct.image,
        regionCode: "RU",
        regionName: "Россия",
        optionName: "Пополнение Steam на " + formatPrice(amount),
        note: "Логин Steam: " + login + " · Комиссия 4% · Курс 1.04",
        priceLabel: formatPrice(totalValue),
        priceValue: totalValue
      });

      if (added) {
        addButton.textContent = "Добавлено";
        window.setTimeout(update, 1200);
      }
    });

    update();
  }

  function init() {
    document.querySelectorAll("[data-steam-topup]").forEach(initTopup);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
