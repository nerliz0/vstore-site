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

  function createMarkup(context) {
    var compact = context === "product";

    return '' +
      '<div class="steam-topup__panel">' +
        '<div class="steam-topup__head">' +
          '<div>' +
            '<p class="steam-topup__eyebrow">Пополнение сервисов</p>' +
            '<h2>' + (compact ? "Калькулятор Steam" : "Быстрое пополнение Steam") + '</h2>' +
            '<span>RU регион, комиссия ' + COMMISSION_PERCENT + '%, курс сайта 1 = ' + RATE.toFixed(2) + '</span>' +
          '</div>' +
          '<div class="steam-topup__service" aria-label="Выбран сервис Steam">' +
            '<img src="' + steamProduct.image + '" alt="" width="224" height="165" loading="lazy" decoding="async" />' +
            '<strong>Steam</strong>' +
          '</div>' +
        '</div>' +
        '<div class="steam-topup__grid">' +
          '<div class="steam-topup__controls">' +
            '<label class="steam-topup__field">' +
              '<span>Получите на баланс</span>' +
              '<input data-steam-amount type="number" min="' + MIN_AMOUNT + '" step="1" inputmode="numeric" value="500" aria-describedby="steam-topup-status" />' +
            '</label>' +
            '<div class="steam-topup__currency" aria-label="Регион и валюта">' +
              '<span>Регион</span>' +
              '<strong>RU, ₽</strong>' +
            '</div>' +
            '<label class="steam-topup__field steam-topup__field--login">' +
              '<span>Логин Steam</span>' +
              '<input data-steam-login type="text" placeholder="Ваш логин Steam" autocomplete="off" />' +
            '</label>' +
            '<button class="btn steam-topup__button" type="button" data-steam-add>В корзину за 520 ₽</button>' +
            '<div class="steam-topup__quick" aria-label="Быстрые суммы">' +
              QUICK_AMOUNTS.map(function (amount) {
                return '<button type="button" data-steam-quick="' + amount + '">' + formatNumber(amount) + ' ₽</button>';
              }).join("") +
            '</div>' +
            '<p class="steam-topup__status" id="steam-topup-status" data-steam-status aria-live="polite"></p>' +
          '</div>' +
          '<div class="steam-topup__summary" aria-label="Сводка пополнения">' +
            '<div><span>К оплате</span><strong data-steam-total>520 ₽</strong></div>' +
            '<div><span>На баланс</span><strong data-steam-receive>500 ₽</strong></div>' +
            '<div><span>Комиссия</span><strong data-steam-fee>20 ₽</strong></div>' +
          '</div>' +
        '</div>' +
        '<div class="steam-topup__notes">' +
          '<article>' +
            '<strong>Как узнать регион?</strong>' +
            '<p>В Steam откройте аккаунт и проверьте страну магазина. Сейчас пополняем только RU.</p>' +
          '</article>' +
          '<article>' +
            '<strong>Как считается комиссия?</strong>' +
            '<p>Сумма пополнения умножается на курс сайта 1.04. Например: 500 ₽ × 1.04 = 520 ₽.</p>' +
          '</article>' +
          '<article>' +
            '<strong>Финальная проверка</strong>' +
            '<p>Итог может отличаться примерно на 5 ₽ в плюс или минус из-за округления и проверки перед выдачей.</p>' +
          '</article>' +
        '</div>' +
      '</div>';
  }

  function initTopup(root) {
    if (!shouldShow(root)) {
      root.hidden = true;
      return;
    }

    root.innerHTML = createMarkup(root.dataset.steamContext || "catalog");
    root.hidden = false;
    if (root.dataset.steamContext === "product") {
      document.body.classList.add("is-steam-product");
    }

    var amountInput = root.querySelector("[data-steam-amount]");
    var loginInput = root.querySelector("[data-steam-login]");
    var addButton = root.querySelector("[data-steam-add]");
    var total = root.querySelector("[data-steam-total]");
    var receive = root.querySelector("[data-steam-receive]");
    var fee = root.querySelector("[data-steam-fee]");
    var status = root.querySelector("[data-steam-status]");

    function update() {
      var amount = parseAmount(amountInput);
      var validAmount = amount >= MIN_AMOUNT;
      var calculatedAmount = validAmount ? amount : MIN_AMOUNT;
      var calculatedTotal = getTotal(calculatedAmount);
      var calculatedFee = calculatedTotal - calculatedAmount;
      var hasLogin = Boolean(String(loginInput.value || "").trim());

      receive.textContent = formatPrice(calculatedAmount);
      total.textContent = formatPrice(calculatedTotal);
      fee.textContent = formatPrice(calculatedFee);
      addButton.textContent = validAmount ? "В корзину за " + formatPrice(calculatedTotal) : "Минимум " + formatPrice(MIN_AMOUNT);
      addButton.disabled = !validAmount || !hasLogin;

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
