(function () {
  "use strict";

  var RATE = 1.04;
  var COMMISSION_PERCENT = 4;
  var MIN_AMOUNT = 300;
  var QUICK_AMOUNTS = [500, 1000, 1500, 2000];
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
            '<button class="steam-topup__help" type="button" data-steam-help>Как узнать логин?</button>' +
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
    var status = root.querySelector("[data-steam-status]");

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

    if (helpButton) {
      helpButton.addEventListener("click", function () {
        status.textContent = "Логин можно посмотреть в Steam: профиль -> аккаунт. Нужен именно логин, не никнейм.";
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
