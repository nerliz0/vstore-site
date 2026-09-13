const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const htmlFiles = ["index.html", "catalog.html", "product.html", "faq.html", "admin.html"];
const release = require(path.join(root, "package.json")).vstoreRelease;

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function loadStaticProducts() {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(read("js/products-data.js"), context);
  return context.window.VSTORE_PRODUCTS;
}

test("static catalog has valid unique products and assets", () => {
  const products = loadStaticProducts();
  const slugs = new Set();
  const allowedFilters = new Set(["games", "subs", "cards", "topup"]);

  assert.ok(Array.isArray(products) && products.length > 0);
  for (const product of products) {
    assert.ok(product.slug, "product slug is required");
    assert.ok(product.title, `${product.slug}: title is required`);
    assert.ok(!slugs.has(product.slug), `duplicate slug: ${product.slug}`);
    slugs.add(product.slug);

    assert.ok(Array.isArray(product.filters) && product.filters.length, `${product.slug}: filters are required`);
    for (const filter of product.filters) {
      assert.ok(allowedFilters.has(filter), `${product.slug}: unknown filter ${filter}`);
    }

    for (const field of ["image", "featuredImage", "featuredMobileImage"]) {
      if (product[field]) {
        assert.ok(
          fs.existsSync(path.join(root, product[field])),
          `${product.slug}: missing ${field} ${product[field]}`
        );
      }
    }
  }
});

test("HTML local resources exist and use one release token", () => {
  for (const htmlFile of htmlFiles) {
    const html = read(htmlFile);
    const references = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map((match) => match[1]);

    for (const reference of references) {
      if (/^(?:https?:|mailto:|tel:|#)/.test(reference)) continue;
      const localPath = reference.split(/[?#]/)[0];
      assert.ok(fs.existsSync(path.join(root, localPath)), `${htmlFile}: missing ${localPath}`);

      if (/^(?:css|js)\//.test(localPath)) {
        const version = new URLSearchParams(reference.split("?")[1] || "").get("v");
        assert.equal(version, release, `${htmlFile}: ${localPath} has an outdated release token`);
      }
    }
  }
});

test("home hero is a product storefront with direct actions", () => {
  const html = read("index.html");
  const textContent = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

  assert.match(textContent, /Игры, подписки и пополнения без лишней возни/);
  assert.match(html, /<h2 id="hero-showcase-title">Сейчас берут<\/h2>/);
  assert.match(html, /href="catalog\.html"[^>]*>[\s\S]*?Открыть каталог/);
  assert.match(html, /href="product\.html\?item=steam"/);
  assert.match(html, /href="product\.html\?item=telegram-premium"/);
  assert.match(html, /href="product\.html\?item=rockstar"/);
  assert.doesNotMatch(html, /Сервис цифровых <br>товаров и подписок/);
  assert.doesNotMatch(html, /Показатели Vstore/);
});

test("mobile storefront keeps images and quick amounts compact", () => {
  const mainJs = read("js/main.js");
  const css = read("css/style.css");

  assert.match(mainJs, /function restoreFeaturedImage\(\)/);
  assert.match(css, /\.hero__products\s*{[^}]*grid-auto-flow:\s*column/s);
  assert.match(css, /\.steam-topup__quick\s*{[^}]*repeat\(auto-fit,\s*minmax\(64px,\s*1fr\)\)/s);
});

test("CSS assets and built-in Steam covers exist", () => {
  const cssDir = path.join(root, "css");
  for (const filename of fs.readdirSync(cssDir).filter((name) => name.endsWith(".css"))) {
    const css = read(path.join("css", filename));
    const references = [...css.matchAll(/url\(["']?([^)"']+)/g)].map((match) => match[1]);
    for (const reference of references) {
      if (/^(?:https?:|data:)/.test(reference)) continue;
      assert.ok(
        fs.existsSync(path.resolve(cssDir, reference.split(/[?#]/)[0])),
        `css/${filename}: missing ${reference}`
      );
    }
  }

  const steamKeys = read("js/steam-keys.js");
  const covers = [...steamKeys.matchAll(/cover:\s*"([^"]+)"/g)]
    .map((match) => match[1])
    .filter(Boolean);
  for (const cover of covers) {
    const relativePath = cover.startsWith("assets/")
      ? cover
      : path.join("assets", "catalog", "steam-keys", cover);
    assert.ok(fs.existsSync(path.join(root, relativePath)), `missing Steam cover: ${relativePath}`);
  }
});

test("all JavaScript files parse", () => {
  const filenames = fs.readdirSync(path.join(root, "js")).filter((name) => name.endsWith(".js"));
  for (const filename of filenames) {
    assert.doesNotThrow(() => new vm.Script(read(path.join("js", filename)), { filename }));
  }
});

test("desktop key cards use five-up fixed grid tracks", () => {
  const productCss = read("css/product.css");
  assert.match(
    productCss,
    /--steam-key-card-width:\s*clamp\(176px,\s*calc\(20%\s*-\s*0\.52rem\),\s*192px\)/
  );
  assert.match(
    productCss,
    /\.steam-keys__grid\s*{[^}]*grid-template-columns:\s*repeat\(auto-fill,\s*minmax\(0,\s*var\(--steam-key-card-width\)\)\)/s
  );
  assert.match(productCss, /\.steam-keys__panel::before\s*{[^}]*content:\s*none/s);
  assert.match(productCss, /\.steam-keys__empty\s*{[^}]*grid-column:\s*1\s*\/\s*-1/s);
});

test("successful empty Supabase catalog does not restore static products", async () => {
  let orderCalls = 0;
  const query = {
    select() { return this; },
    eq() { return this; },
    order() {
      orderCalls += 1;
      return orderCalls === 2 ? Promise.resolve({ data: [], error: null }) : this;
    }
  };
  const context = {
    console,
    window: {
      VSTORE_PRODUCTS: [{ slug: "fallback" }],
      VSTORE_SUPABASE_URL: "https://example.supabase.co",
      VSTORE_SUPABASE_ANON_KEY: "public-key",
      supabase: { createClient: () => ({ from: () => query }) }
    }
  };

  vm.createContext(context);
  vm.runInContext(read("js/supabase-products.js"), context);
  await context.window.VSTORE_PRODUCTS_READY;
  assert.deepEqual(context.window.VSTORE_PRODUCTS, []);
});

test("authenticated non-admin sessions are rejected", async () => {
  let signOutCalls = 0;
  let checkedTable = "";
  const accessQuery = {
    select() { return this; },
    eq() { return this; },
    maybeSingle() { return Promise.resolve({ data: null, error: null }); }
  };
  const client = {
    auth: {
      getSession: () => Promise.resolve({
        data: { session: { user: { id: "user-without-admin-role" } } },
        error: null
      }),
      signOut: async () => { signOutCalls += 1; }
    },
    from(table) {
      checkedTable = table;
      return accessQuery;
    }
  };
  const context = {
    console,
    localStorage: { getItem: () => null, setItem() {} },
    window: {
      VSTORE_PRODUCTS: [],
      VSTORE_SUPABASE_URL: "https://example.supabase.co",
      VSTORE_SUPABASE_ANON_KEY: "public-key",
      supabase: { createClient: () => client },
      location: { hash: "" }
    },
    document: {
      querySelector: () => null,
      querySelectorAll: () => []
    }
  };

  vm.createContext(context);
  vm.runInContext(read("js/admin.js"), context);
  await new Promise((resolve) => setImmediate(resolve));
  await new Promise((resolve) => setImmediate(resolve));

  assert.equal(checkedTable, "admin_users");
  assert.equal(signOutCalls, 1);
});

test("cart merges equal items and calculates totals", () => {
  const storage = new Map();
  const context = {
    CustomEvent: function CustomEvent(type, options) {
      this.type = type;
      this.detail = options.detail;
    },
    Intl,
    console,
    window: {
      VSTORE_CONFIG: {},
      localStorage: {
        getItem: (key) => storage.get(key) || null,
        setItem: (key, value) => storage.set(key, value)
      },
      addEventListener() {},
      dispatchEvent() {},
      setTimeout() {}
    },
    document: {
      readyState: "loading",
      addEventListener() {}
    }
  };

  vm.createContext(context);
  vm.runInContext(read("js/cart.js"), context);
  const cart = context.window.VSTORE_CART;
  const item = {
    slug: "steam",
    title: "Steam",
    optionName: "1000 ₽",
    priceLabel: "1 150 ₽",
    priceValue: 1150,
    quantity: 1
  };

  assert.equal(cart.add(item), true);
  assert.equal(cart.add(item), true);
  assert.equal(cart.getItems().length, 1);
  assert.equal(cart.getCount(), 2);
  assert.equal(cart.getTotal(), 2300);
});

test("Supabase schema includes editions and admin RLS", () => {
  const schema = read("supabase/schema.sql");
  assert.match(schema, /editions jsonb not null/);
  assert.match(schema, /alter table public\.admin_users enable row level security/);
  assert.match(schema, /using \(public\.is_admin\(\)\)/);
});
