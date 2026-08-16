(function () {
  "use strict";

  var loginView = document.querySelector("[data-login-view]");
  var adminView = document.querySelector("[data-admin-view]");
  var loginForm = document.querySelector("[data-login-form]");
  var loginStatus = document.querySelector("[data-login-status]");
  var list = document.querySelector("[data-products-list]");
  var count = document.querySelector("[data-products-count]");
  var form = document.querySelector("[data-product-form]");
  var editorTitle = document.querySelector("[data-editor-title]");
  var saveStatus = document.querySelector("[data-save-status]");
  var currentProduct = null;
  var products = [];

  if (!window.supabase || !window.VSTORE_SUPABASE_URL || !window.VSTORE_SUPABASE_ANON_KEY) {
    if (loginStatus) loginStatus.textContent = "Supabase не подключен. Проверь js/supabase-config.js.";
    return;
  }

  var client = window.supabase.createClient(
    window.VSTORE_SUPABASE_URL,
    window.VSTORE_SUPABASE_ANON_KEY
  );

  function setStatus(node, text) {
    if (node) node.textContent = text || "";
  }

  function toList(value) {
    return String(value || "")
      .split(",")
      .map(function (item) {
        return item.trim();
      })
      .filter(Boolean);
  }

  function fromList(value) {
    return Array.isArray(value) ? value.join(", ") : "";
  }

  function stringify(value) {
    return JSON.stringify(value || [], null, 2);
  }

  function parseJsonField(name) {
    var value = form.elements[name].value.trim();
    if (!value) return [];
    return JSON.parse(value);
  }

  function productToRow(product) {
    return {
      slug: product.slug,
      title: product.title,
      category: product.category || "",
      filters: product.filters || [],
      image: product.image || "",
      featured_image: product.featuredImage || product.featured_image || "",
      featured_mobile_image: product.featuredMobileImage || product.featured_mobile_image || "",
      featured_title: product.featuredTitle || product.featured_title || product.title,
      aliases: product.aliases || [],
      items: product.items || [],
      price_from: product.priceFrom || product.price_from || "",
      description: product.description || "",
      accent: product.accent || "#8b5cf6",
      accent_rgb: product.accentRgb || product.accent_rgb || "139, 92, 246",
      watermark: product.watermark || product.title || "",
      benefits: product.benefits || [],
      details: product.details || [],
      guarantee: product.guarantee || "",
      prices: product.prices || [],
      regions: product.regions || [],
      active: product.active !== false,
      sort_order: Number.isFinite(Number(product.sortOrder || product.sort_order))
        ? Number(product.sortOrder || product.sort_order)
        : 100
    };
  }

  function rowToProduct(row) {
    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      category: row.category || "",
      filters: row.filters || [],
      image: row.image || "",
      featuredImage: row.featured_image || "",
      featuredMobileImage: row.featured_mobile_image || "",
      featuredTitle: row.featured_title || "",
      aliases: row.aliases || [],
      items: row.items || [],
      priceFrom: row.price_from || "",
      description: row.description || "",
      accent: row.accent || "#8b5cf6",
      accentRgb: row.accent_rgb || "139, 92, 246",
      watermark: row.watermark || "",
      benefits: row.benefits || [],
      details: row.details || [],
      guarantee: row.guarantee || "",
      prices: row.prices || [],
      regions: row.regions || [],
      active: row.active !== false,
      sortOrder: row.sort_order || 100
    };
  }

  function showAdmin() {
    if (loginView) loginView.hidden = true;
    if (adminView) adminView.hidden = false;
  }

  function showLogin() {
    if (loginView) loginView.hidden = false;
    if (adminView) adminView.hidden = true;
  }

  function createEmptyProduct() {
    return {
      slug: "new-product",
      title: "Новый товар",
      category: "Игры",
      filters: ["games"],
      image: "assets/catalog/fortnite-vstore.png",
      featuredImage: "",
      featuredMobileImage: "",
      featuredTitle: "",
      aliases: [],
      items: [],
      priceFrom: "по запросу",
      description: "",
      accent: "#8b5cf6",
      accentRgb: "139, 92, 246",
      watermark: "VSTORE",
      benefits: [],
      details: [],
      guarantee: "",
      prices: [],
      regions: [],
      active: true,
      sortOrder: 100
    };
  }

  function renderList() {
    if (!list) return;
    list.replaceChildren();
    if (count) count.textContent = String(products.length);

    products.forEach(function (product) {
      var button = document.createElement("button");
      var title = document.createElement("strong");
      var meta = document.createElement("span");

      button.className = "admin-product";
      button.type = "button";
      if (currentProduct && currentProduct.slug === product.slug) button.classList.add("is-active");
      title.textContent = product.title;
      meta.textContent = product.slug + " · " + (product.active ? "активен" : "скрыт");
      button.appendChild(title);
      button.appendChild(meta);
      button.addEventListener("click", function () {
        fillForm(product);
      });
      list.appendChild(button);
    });
  }

  function fillForm(product) {
    currentProduct = product;
    if (editorTitle) editorTitle.textContent = product.title || "Новый товар";

    form.elements.slug.value = product.slug || "";
    form.elements.title.value = product.title || "";
    form.elements.category.value = product.category || "";
    form.elements.priceFrom.value = product.priceFrom || "";
    form.elements.image.value = product.image || "";
    form.elements.featuredImage.value = product.featuredImage || "";
    form.elements.featuredMobileImage.value = product.featuredMobileImage || "";
    form.elements.featuredTitle.value = product.featuredTitle || "";
    form.elements.filters.value = fromList(product.filters);
    form.elements.items.value = fromList(product.items);
    form.elements.aliases.value = fromList(product.aliases);
    form.elements.sortOrder.value = product.sortOrder || 100;
    form.elements.description.value = product.description || "";
    form.elements.accent.value = product.accent || "#8b5cf6";
    form.elements.accentRgb.value = product.accentRgb || "139, 92, 246";
    form.elements.watermark.value = product.watermark || "";
    form.elements.guarantee.value = product.guarantee || "";
    form.elements.active.checked = product.active !== false;
    form.elements.benefits.value = stringify(product.benefits);
    form.elements.details.value = stringify(product.details);
    form.elements.prices.value = stringify(product.prices);
    form.elements.regions.value = stringify(product.regions);

    renderList();
  }

  function readForm() {
    return {
      id: currentProduct ? currentProduct.id : null,
      slug: form.elements.slug.value.trim(),
      title: form.elements.title.value.trim(),
      category: form.elements.category.value.trim(),
      priceFrom: form.elements.priceFrom.value.trim(),
      image: form.elements.image.value.trim(),
      featuredImage: form.elements.featuredImage.value.trim(),
      featuredMobileImage: form.elements.featuredMobileImage.value.trim(),
      featuredTitle: form.elements.featuredTitle.value.trim(),
      filters: toList(form.elements.filters.value),
      items: toList(form.elements.items.value),
      aliases: toList(form.elements.aliases.value),
      sortOrder: Number(form.elements.sortOrder.value) || 100,
      description: form.elements.description.value.trim(),
      accent: form.elements.accent.value.trim() || "#8b5cf6",
      accentRgb: form.elements.accentRgb.value.trim() || "139, 92, 246",
      watermark: form.elements.watermark.value.trim(),
      guarantee: form.elements.guarantee.value.trim(),
      active: form.elements.active.checked,
      benefits: parseJsonField("benefits"),
      details: parseJsonField("details"),
      prices: parseJsonField("prices"),
      regions: parseJsonField("regions")
    };
  }

  async function loadProducts() {
    setStatus(saveStatus, "Загружаю товары...");
    var result = await client
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("title", { ascending: true });

    if (result.error) {
      setStatus(saveStatus, "Ошибка: " + result.error.message);
      return;
    }

    products = (result.data || []).map(rowToProduct);
    renderList();
    if (products.length) fillForm(products[0]);
    else fillForm(createEmptyProduct());
    setStatus(saveStatus, products.length ? "Готово" : "База пустая. Можно импортировать текущий каталог.");
  }

  async function saveProduct(event) {
    event.preventDefault();
    setStatus(saveStatus, "Сохраняю...");

    try {
      var product = readForm();
      var row = productToRow(product);
      var request = currentProduct && currentProduct.id
        ? client.from("products").update(row).eq("id", currentProduct.id).select("*").single()
        : client.from("products").insert(row).select("*").single();
      var result = await request;

      if (result.error) throw result.error;
      setStatus(saveStatus, "Сохранено");
      await loadProducts();
      if (result.data) fillForm(rowToProduct(result.data));
    } catch (error) {
      setStatus(saveStatus, "Ошибка: " + error.message);
    }
  }

  async function deleteProduct() {
    if (!currentProduct || !currentProduct.id) return;
    if (!window.confirm("Удалить товар " + currentProduct.title + "?")) return;

    setStatus(saveStatus, "Удаляю...");
    var result = await client.from("products").delete().eq("id", currentProduct.id);
    if (result.error) {
      setStatus(saveStatus, "Ошибка: " + result.error.message);
      return;
    }

    currentProduct = null;
    await loadProducts();
  }

  async function importStaticProducts() {
    var staticProducts = window.VSTORE_PRODUCTS || [];
    if (!staticProducts.length) {
      setStatus(saveStatus, "Статичный каталог не найден.");
      return;
    }

    setStatus(saveStatus, "Импортирую " + staticProducts.length + " товаров...");
    var rows = staticProducts.map(function (product, index) {
      var row = productToRow(product);
      row.sort_order = index + 1;
      return row;
    });
    var result = await client
      .from("products")
      .upsert(rows, { onConflict: "slug" })
      .select("id");

    if (result.error) {
      setStatus(saveStatus, "Ошибка импорта: " + result.error.message);
      return;
    }

    setStatus(saveStatus, "Каталог импортирован");
    await loadProducts();
  }

  async function init() {
    var sessionResult = await client.auth.getSession();
    if (sessionResult.data && sessionResult.data.session) {
      showAdmin();
      loadProducts();
    } else {
      showLogin();
    }
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      setStatus(loginStatus, "Вхожу...");
      var data = new FormData(loginForm);
      var result = await client.auth.signInWithPassword({
        email: String(data.get("email") || ""),
        password: String(data.get("password") || "")
      });

      if (result.error) {
        setStatus(loginStatus, result.error.message);
        return;
      }

      setStatus(loginStatus, "");
      showAdmin();
      loadProducts();
    });
  }

  if (form) form.addEventListener("submit", saveProduct);

  var signOut = document.querySelector("[data-sign-out]");
  if (signOut) {
    signOut.addEventListener("click", async function () {
      await client.auth.signOut();
      showLogin();
    });
  }

  var newProduct = document.querySelector("[data-new-product]");
  if (newProduct) {
    newProduct.addEventListener("click", function () {
      fillForm(createEmptyProduct());
      setStatus(saveStatus, "Новый товар. Поменяй slug перед сохранением.");
    });
  }

  var importProducts = document.querySelector("[data-import-products]");
  if (importProducts) importProducts.addEventListener("click", importStaticProducts);

  var deleteButton = document.querySelector("[data-delete-product]");
  if (deleteButton) deleteButton.addEventListener("click", deleteProduct);

  init();
})();
