(function () {
  "use strict";

  var COMMISSION_TIERS = [
    { max: 1000, percent: 8 },
    { max: 2000, percent: 6 },
    { max: Infinity, percent: 4 }
  ];
  var MIN_AMOUNT = 300;
  var QUICK_AMOUNTS = [500, 1000, 1500, 2000];
  var STAR_MIN_AMOUNT = 50;
  var STAR_MAX_AMOUNT = 10000;
  var STAR_STEP = 50;
  var STAR_QUICK_AMOUNTS = [100, 500, 1000];
  var STAR_PACKS = [
    { amount: 50, price: 75 },
    { amount: 100, price: 145 },
    { amount: 200, price: 295 },
    { amount: 250, price: 380 },
    { amount: 500, price: 750 },
    { amount: 750, price: 1125 },
    { amount: 1000, price: 1490 },
    { amount: 1500, price: 2240 },
    { amount: 2000, price: 3000 },
    { amount: 3000, price: 4480 },
    { amount: 5000, price: 7450 },
    { amount: 10000, price: 14900 }
  ];
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
  var telegramProduct = products.find(function (product) {
    return product.slug === "telegram-premium";
  }) || {
    slug: "telegram-premium",
    title: "Telegram",
    image: "assets/catalog/telegram-vstore-224x165.png"
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

  function formatStars(value) {
    return formatNumber(value) + " ⭐";
  }

  function getStarOffer(amount) {
    var target = Number(amount) || 0;
    var dp = [{ price: 0, packs: [] }];
    var index;

    if (target < STAR_MIN_AMOUNT || target > STAR_MAX_AMOUNT || target % STAR_STEP !== 0) {
      return null;
    }

    for (index = STAR_STEP; index <= target; index += STAR_STEP) {
      dp[index] = null;
      STAR_PACKS.forEach(function (pack) {
        var previous = dp[index - pack.amount];
        var nextPrice;
        if (!previous) return;
        nextPrice = previous.price + pack.price;
        if (!dp[index] || nextPrice < dp[index].price) {
          dp[index] = {
            price: nextPrice,
            packs: previous.packs.concat(pack.amount)
          };
        }
      });
    }

    if (!dp[target]) return null;

    return {
      amount: target,
      price: dp[target].price,
      packs: dp[target].packs
    };
  }

  function describeStarPacks(packs) {
    var counts = {};
    packs.forEach(function (amount) {
      counts[amount] = (counts[amount] || 0) + 1;
    });
    return Object.keys(counts).map(Number).sort(function (a, b) {
      return b - a;
    }).map(function (amount) {
      return counts[amount] > 1 ? formatStars(amount) + " × " + counts[amount] : formatStars(amount);
    }).join(" + ");
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
            '<button class="steam-topup__service is-active" type="button" data-topup-service="steam"><img src="' + STEAM_SERVICE_ICON + '" alt="" width="24" height="24" loading="lazy" decoding="async" /><strong>Steam</strong></button>' +
            '<button class="steam-topup__service" type="button" data-topup-service="telegram"><img src="' + TELEGRAM_SERVICE_ICON + '" alt="" width="24" height="24" loading="lazy" decoding="async" /><strong>Telegram</strong></button>' +
          '</div>' +
        '</div>' +
        '<div class="steam-topup__form">' +
          '<div class="steam-topup__amount-block">' +
            '<div class="steam-topup__amount-row">' +
              '<label class="steam-topup__field">' +
                '<span data-topup-amount-label>Получите</span>' +
                '<input data-topup-amount type="number" min="' + MIN_AMOUNT + '" step="1" inputmode="numeric" value="500" aria-describedby="steam-topup-status" />' +
              '</label>' +
              '<div class="steam-topup__currency" aria-label="Регион и валюта" data-topup-currency>' +
                '<strong data-topup-currency-label>RU, ₽</strong>' +
                '<span aria-hidden="true" data-topup-currency-arrow>⌄</span>' +
              '</div>' +
            '</div>' +
            '<div class="steam-topup__quick" aria-label="Быстрые суммы" data-topup-quick>' +
              QUICK_AMOUNTS.map(function (amount) {
                return '<button type="button" data-topup-quick-value="' + amount + '">' + formatNumber(amount) + ' ₽</button>';
              }).join("") +
            '</div>' +
          '</div>' +
          '<div class="steam-topup__login-block">' +
            '<label class="steam-topup__field steam-topup__field--login">' +
              '<span data-topup-login-label>Логин Steam</span>' +
              '<input data-topup-login type="text" placeholder="Логин Steam" autocomplete="off" />' +
            '</label>' +
            '<div class="steam-topup__links" data-steam-links>' +
              '<button class="steam-topup__help" type="button" aria-haspopup="dialog" aria-expanded="false" data-steam-help>Как узнать логин?</button>' +
              '<button class="steam-topup__help" type="button" aria-haspopup="dialog" aria-expanded="false" data-steam-commission>Как рассчитывается комиссия?</button>' +
            '</div>' +
          '</div>' +
          '<button class="steam-topup__button" type="button" data-topup-add>Купить за 540 ₽</button>' +
        '</div>' +
        '<p class="steam-topup__status" id="steam-topup-status" data-steam-status aria-live="polite"></p>' +
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
          '<h2 id="steam-commission-modal-title" data-topup-info-title>Как считается комиссия?</h2>' +
          '<p class="steam-login-modal__lead" data-topup-info-lead>Комиссия зависит от суммы пополнения: от 300 до 1000 ₽ — 8%, от 1001 до 2000 ₽ — 6%, от 2001 ₽ и выше — 4%.</p>' +
          '<div class="steam-commission-example" aria-label="Пример расчета комиссии">' +
            '<span data-topup-info-left>500 ₽</span>' +
            '<i data-topup-info-operator>×</i>' +
            '<span data-topup-info-middle>1.08</span>' +
            '<i data-topup-info-equals>=</i>' +
            '<strong data-topup-info-result>540 ₽</strong>' +
          '</div>' +
          '<p class="steam-login-modal__warning" data-topup-info-warning>Примеры: 1500 ₽ × 1.06 = 1590 ₽, 3000 ₽ × 1.04 = 3120 ₽. Итог может отличаться примерно на 5 ₽ в плюс или минус из-за округления и финальной проверки перед выдачей.</p>' +
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

    var activeService = "steam";
    var amountInput = root.querySelector("[data-topup-amount]");
    var amountLabel = root.querySelector("[data-topup-amount-label]");
    var currency = root.querySelector("[data-topup-currency]");
    var currencyLabel = root.querySelector("[data-topup-currency-label]");
    var currencyArrow = root.querySelector("[data-topup-currency-arrow]");
    var loginInput = root.querySelector("[data-topup-login]");
    var loginLabel = root.querySelector("[data-topup-login-label]");
    var addButton = root.querySelector("[data-topup-add]");
    var quickWrap = root.querySelector("[data-topup-quick]");
    var serviceButtons = root.querySelectorAll("[data-topup-service]");
    var steamLinks = root.querySelector("[data-steam-links]");
    var helpButton = root.querySelector("[data-steam-help]");
    var commissionButton = root.querySelector("[data-steam-commission]");
    var helpModal = root.querySelector("[data-steam-login-modal]");
    var commissionModal = root.querySelector("[data-steam-commission-modal]");
    var infoTitle = root.querySelector("[data-topup-info-title]");
    var infoLead = root.querySelector("[data-topup-info-lead]");
    var infoLeft = root.querySelector("[data-topup-info-left]");
    var infoOperator = root.querySelector("[data-topup-info-operator]");
    var infoMiddle = root.querySelector("[data-topup-info-middle]");
    var infoEquals = root.querySelector("[data-topup-info-equals]");
    var infoResult = root.querySelector("[data-topup-info-result]");
    var infoWarning = root.querySelector("[data-topup-info-warning]");
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

    function renderQuickButtons() {
      var amounts = activeService === "telegram" ? STAR_QUICK_AMOUNTS : QUICK_AMOUNTS;
      if (!quickWrap) return;
      quickWrap.innerHTML = amounts.map(function (amount) {
        var label = activeService === "telegram" ? formatStars(amount) : formatNumber(amount) + " ₽";
        return '<button type="button" data-topup-quick-value="' + amount + '">' + label + '</button>';
      }).join("");

      quickWrap.querySelectorAll("[data-topup-quick-value]").forEach(function (button) {
        button.addEventListener("click", function () {
          amountInput.value = button.dataset.topupQuickValue;
          update();
        });
      });
    }

    function updateSteam() {
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

    function updateTelegram() {
      var amount = parseAmount(amountInput);
      var offer = getStarOffer(amount);
      var username = String(loginInput.value || "").trim();
      var hasUsername = Boolean(username);

      if (offer) {
        addButton.textContent = "Купить за " + formatPrice(offer.price);
      } else {
        addButton.textContent = "Введите кратно " + formatStars(STAR_STEP);
      }
      addButton.disabled = !offer;

      if (!offer) {
        status.textContent = "Можно выбрать только кратные " + formatStars(STAR_STEP) + " значения от " + formatStars(STAR_MIN_AMOUNT) + " до " + formatStars(STAR_MAX_AMOUNT) + ".";
      } else if (!hasUsername) {
        status.textContent = "Укажите Telegram username, чтобы добавить звёзды в корзину.";
      } else {
        status.textContent = "К оплате: " + formatPrice(offer.price) + ". Звёзды: " + formatStars(offer.amount) + ". Номиналы: " + describeStarPacks(offer.packs) + ".";
      }
    }

    function update() {
      if (activeService === "telegram") updateTelegram();
      else updateSteam();
    }

    function setService(service) {
      activeService = service === "telegram" ? "telegram" : "steam";
      root.classList.toggle("is-telegram-topup", activeService === "telegram");

      serviceButtons.forEach(function (button) {
        button.classList.toggle("is-active", button.dataset.topupService === activeService);
      });

      if (activeService === "telegram") {
        if (amountLabel) amountLabel.textContent = "Звёзды";
        if (currency) currency.setAttribute("aria-label", "Сервис");
        if (currencyLabel) currencyLabel.textContent = "Telegram";
        if (currencyArrow) currencyArrow.hidden = true;
        if (loginLabel) loginLabel.textContent = "Username";
        amountInput.min = String(STAR_MIN_AMOUNT);
        amountInput.max = String(STAR_MAX_AMOUNT);
        amountInput.step = String(STAR_STEP);
        amountInput.value = "500";
        loginInput.placeholder = "@username";
        loginInput.value = "";
        if (steamLinks) steamLinks.hidden = false;
        if (helpButton) helpButton.hidden = true;
        if (commissionButton) commissionButton.textContent = "Как рассчитывается номинал?";
        if (infoTitle) infoTitle.textContent = "Как рассчитывается номинал?";
        if (infoLead) infoLead.textContent = "Звёзды можно купить только кратно 50: 50, 100, 150, 200 и так далее до 10 000. Если готового пакета нет, сайт собирает сумму из доступных номиналов.";
        if (infoLeft) infoLeft.textContent = "400 ⭐";
        if (infoOperator) infoOperator.textContent = "=";
        if (infoMiddle) infoMiddle.textContent = "200 ⭐ + 200 ⭐";
        if (infoEquals) infoEquals.textContent = "→";
        if (infoResult) infoResult.textContent = "590 ₽";
        if (infoWarning) infoWarning.textContent = "Некратные значения вроде 57, 60 или 80 звёзд не принимаются. Подойдут 50, 150, 400, 750, 1250 и другие суммы с шагом 50.";
      } else {
        if (amountLabel) amountLabel.textContent = "Получите";
        if (currency) currency.setAttribute("aria-label", "Регион и валюта");
        if (currencyLabel) currencyLabel.textContent = "RU, ₽";
        if (currencyArrow) currencyArrow.hidden = false;
        if (loginLabel) loginLabel.textContent = "Логин Steam";
        amountInput.min = String(MIN_AMOUNT);
        amountInput.removeAttribute("max");
        amountInput.step = "1";
        amountInput.value = "500";
        loginInput.placeholder = "Логин Steam";
        loginInput.value = "";
        if (steamLinks) steamLinks.hidden = false;
        if (helpButton) helpButton.hidden = false;
        if (commissionButton) commissionButton.textContent = "Как рассчитывается комиссия?";
        if (infoTitle) infoTitle.textContent = "Как считается комиссия?";
        if (infoLead) infoLead.textContent = "Комиссия зависит от суммы пополнения: от 300 до 1000 ₽ — 8%, от 1001 до 2000 ₽ — 6%, от 2001 ₽ и выше — 4%.";
        if (infoLeft) infoLeft.textContent = "500 ₽";
        if (infoOperator) infoOperator.textContent = "×";
        if (infoMiddle) infoMiddle.textContent = "1.08";
        if (infoEquals) infoEquals.textContent = "=";
        if (infoResult) infoResult.textContent = "540 ₽";
        if (infoWarning) infoWarning.textContent = "Примеры: 1500 ₽ × 1.06 = 1590 ₽, 3000 ₽ × 1.04 = 3120 ₽. Итог может отличаться примерно на 5 ₽ в плюс или минус из-за округления и финальной проверки перед выдачей.";
      }

      renderQuickButtons();
      update();
    }

    amountInput.addEventListener("input", update);
    loginInput.addEventListener("input", update);

    serviceButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        setService(button.dataset.topupService);
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
      var totalValue;
      var commissionPercent;
      var starOffer;
      var username;
      var added;

      if (!window.VSTORE_CART) {
        update();
        return;
      }

      if (activeService === "telegram") {
        starOffer = getStarOffer(amount);
        username = login.replace(/^@+/, "");
        if (!starOffer || !username) {
          update();
          return;
        }

        added = window.VSTORE_CART.add({
          slug: telegramProduct.slug,
          title: telegramProduct.title,
          image: telegramProduct.image,
          regionCode: "TG",
          regionName: "Telegram Stars",
          optionName: formatStars(starOffer.amount) + " Telegram Stars",
          note: "Username: @" + username + " · Номиналы: " + describeStarPacks(starOffer.packs),
          priceLabel: formatPrice(starOffer.price),
          priceValue: starOffer.price
        });
      } else {
        if (amount < MIN_AMOUNT || !login) {
          update();
          return;
        }

        totalValue = getTotal(amount);
        commissionPercent = getCommissionPercent(amount);
        added = window.VSTORE_CART.add({
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
      }

      if (added) {
        addButton.textContent = "Добавлено";
        window.setTimeout(update, 1200);
      }
    });

    renderQuickButtons();
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
