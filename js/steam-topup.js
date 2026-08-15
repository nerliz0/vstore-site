(function () {
  "use strict";

  var COMMISSION_TIERS = [
    { max: 1000, percent: 8 },
    { max: 2000, percent: 6 },
    { max: Infinity, percent: 4 }
  ];
  var MIN_AMOUNT = 300;
  var QUICK_AMOUNTS = [500, 1000, 1500, 2000];
  var LOGIN_HELP_IMAGE = "assets/catalog/62f7ed6d-ac6b-42cd-a75f-c5caf8019699.png";
  var STEAM_SERVICE_ICON = "assets/catalog/service-icons/steam.svg";
  var TELEGRAM_SERVICE_ICON = "assets/catalog/service-icons/telegram.svg";
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

  function getCommissionPercent(amount) {
    var tier = COMMISSION_TIERS.find(function (item) {
      return amount <= item.max;
    });
    return tier ? tier.percent : 4;
  }

  function getTotal(amount) {
    var percent = getCommissionPercent(amount);
    return Math.round(amount * (1 + percent / 100));
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
            '<span class="steam-topup__service is-active"><img src="' + STEAM_SERVICE_ICON + '" alt="" width="24" height="24" loading="lazy" decoding="async" /><strong>Steam</strong></span>' +
            '<span class="steam-topup__service"><img src="' + TELEGRAM_SERVICE_ICON + '" alt="" width="24" height="24" loading="lazy" decoding="async" /><strong>Telegram</strong></span>' +
          '</div>' +
        '</div>' +
        '<div class="steam-topup__form">' +
          '<div class="steam-topup__amount-block">' +
            '<div class="steam-topup__amount-row">' +
              '<label class="steam-topup__field">' +
                '<span>Получите</span>' +
                '<input data-steam-amount type="number" min="' + MIN_AMOUNT + '" step="1" inputmode="numeric" value="500" aria-describedby="steam-topup-status" />' +
              '</label>' +
              '<div class="steam-topup__currency" aria-label="Регион и валюта">' +
                '<strong>RU, ₽</strong>' +
                '<span aria-hidden="true">⌄</span>' +
              '</div>' +
            '</div>' +
            '<div class="steam-topup__quick" aria-label="Быстрые суммы">' +
              QUICK_AMOUNTS.map(function (amount) {
                return '<button type="button" data-steam-quick="' + amount + '">' + formatNumber(amount) + ' ₽</button>';
              }).join("") +
            '</div>' +
          '</div>' +
          '<div class="steam-topup__login-block">' +
            '<label class="steam-topup__field steam-topup__field--login">' +
              '<span>Логин Steam</span>' +
              '<input data-steam-login type="text" placeholder="Логин Steam" autocomplete="off" />' +
            '</label>' +
            '<button class="steam-topup__help" type="button" aria-haspopup="dialog" aria-expanded="false" data-steam-help>Как узнать логин?</button>' +
          '</div>' +
          '<button class="steam-topup__button" type="button" data-steam-add>Купить за 540 ₽</button>' +
        '</div>' +
        '<p class="steam-topup__status" id="steam-topup-status" data-steam-status aria-live="polite"></p>' +
        '<p class="steam-topup__summary-line"><button type="button" aria-haspopup="dialog" aria-expanded="false" data-steam-commission>Как рассчитывается комиссия?</button></p>' +
      '</div>' +
      '<div class="steam-login-modal" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="steam-login-modal-title" data-steam-login-modal>' +
        '<button class="steam-login-modal__backdrop" type="button" tabindex="-1" aria-hidden="true" data-steam-help-close></button>' +
        '<div class="steam-login-modal__dialog">' +
          '<button class="steam-login-modal__close" type="button" aria-label="Закрыть" data-steam-help-close>×</button>' +
          '<h2 id="steam-login-modal-title">Как узнать свой логин Steam?</h2>' +
          '<p class="steam-login-modal__lead">Логин Steam — это то, что вы вводите для входа в аккаунт. Его можно посмотреть на <a href="https://store.steampowered.com/account/" target="_blank" rel="noopener noreferrer">странице аккаунта Steam</a>.</p>' +
          '<img class="steam-login-modal__image" src="' + LOGIN_HELP_IMAGE + '" alt="Пример страницы аккаунта Steam с логином Vstore Account" width="1672" height="941" loading="lazy" decoding="async" />' +
          '<p class="steam-login-modal__warning">Будьте внимательны: если указать неправильный логин, пополнение может уйти другому пользователю.</p>' +
          '<button class="steam-login-modal__ok" type="button" data-steam-help-close>Понятно</button>' +
        '</div>' +
      '</div>' +
      '<div class="steam-login-modal" role="dialog" aria-modal="true" aria-hidden="true" aria-labelledby="steam-commission-modal-title" data-steam-commission-modal>' +
        '<button class="steam-login-modal__backdrop" type="button" tabindex="-1" aria-hidden="true" data-steam-help-close></button>' +
        '<div class="steam-login-modal__dialog steam-login-modal__dialog--compact">' +
          '<button class="steam-login-modal__close" type="button" aria-label="Закрыть" data-steam-help-close>×</button>' +
          '<h2 id="steam-commission-modal-title">Как считается комиссия?</h2>' +
          '<p class="steam-login-modal__lead">Комиссия зависит от суммы пополнения: от 300 до 1000 ₽ — 8%, от 1001 до 2000 ₽ — 6%, от 2001 ₽ и выше — 4%.</p>' +
          '<div class="steam-commission-example" aria-label="Пример расчета комиссии">' +
            '<span>500 ₽</span>' +
            '<i>×</i>' +
            '<span>1.08</span>' +
            '<i>=</i>' +
            '<strong>540 ₽</strong>' +
          '</div>' +
          '<p class="steam-login-modal__warning">Примеры: 1500 ₽ × 1.06 = 1590 ₽, 3000 ₽ × 1.04 = 3120 ₽. Итог может отличаться примерно на 5 ₽ в плюс или минус из-за округления и финальной проверки перед выдачей.</p>' +
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
    var commissionButton = root.querySelector("[data-steam-commission]");
    var helpModal = root.querySelector("[data-steam-login-modal]");
    var commissionModal = root.querySelector("[data-steam-commission-modal]");
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
      var commissionPercent = getCommissionPercent(calculatedAmount);
      var hasLogin = Boolean(String(loginInput.value || "").trim());

      addButton.textContent = validAmount ? "Купить за " + formatPrice(calculatedTotal) : "Минимум " + formatPrice(MIN_AMOUNT);
      addButton.disabled = !validAmount;

      if (!validAmount) {
        status.textContent = "Минимальная сумма пополнения — " + formatPrice(MIN_AMOUNT) + ".";
      } else if (!hasLogin) {
        status.textContent = "Укажите логин Steam, чтобы добавить пополнение в корзину.";
      } else {
        status.textContent = "К оплате: " + formatPrice(calculatedTotal) + ". На баланс Steam: " + formatPrice(calculatedAmount) + ". Комиссия " + commissionPercent + "%.";
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

    function openModal(modal, trigger) {
      if (!modal) return;
      helpLastFocus = document.activeElement;
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      if (trigger) trigger.setAttribute("aria-expanded", "true");
      document.body.classList.add("steam-login-modal-open");

      var closeButton = modal.querySelector(".steam-login-modal__close");
      focusElement(closeButton);
    }

    function closeOpenModal() {
      var openedModal = root.querySelector(".steam-login-modal.is-open");
      if (!openedModal) return;
      openedModal.classList.remove("is-open");
      openedModal.setAttribute("aria-hidden", "true");
      if (helpButton) helpButton.setAttribute("aria-expanded", "false");
      if (commissionButton) commissionButton.setAttribute("aria-expanded", "false");
      document.body.classList.remove("steam-login-modal-open");
      if (helpLastFocus && typeof helpLastFocus.focus === "function") {
        focusElement(helpLastFocus);
      }
      helpLastFocus = null;
    }

    if (helpButton && helpModal) {
      helpButton.addEventListener("click", function () {
        openModal(helpModal, helpButton);
      });
    }

    if (commissionButton && commissionModal) {
      commissionButton.addEventListener("click", function () {
        openModal(commissionModal, commissionButton);
      });
    }

    if ((helpButton && helpModal) || (commissionButton && commissionModal)) {
      helpCloseButtons.forEach(function (button) {
        button.addEventListener("click", closeOpenModal);
      });
      document.addEventListener("keydown", function (event) {
        if (event.key !== "Escape" || !root.querySelector(".steam-login-modal.is-open")) return;
        closeOpenModal();
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
      var commissionPercent = getCommissionPercent(amount);
      var added = window.VSTORE_CART.add({
        slug: steamProduct.slug,
        title: steamProduct.title,
        image: steamProduct.image,
        regionCode: "RU",
        regionName: "Россия",
        optionName: "Пополнение Steam на " + formatPrice(amount),
        note: "Логин Steam: " + login + " · Комиссия " + commissionPercent + "%",
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
