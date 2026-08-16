(function () {
  "use strict";

  function asArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function mapProduct(row) {
    return {
      slug: row.slug,
      title: row.title,
      category: row.category || "",
      filters: asArray(row.filters),
      image: row.image || "",
      featuredImage: row.featured_image || row.image || "",
      featuredMobileImage: row.featured_mobile_image || row.featured_image || row.image || "",
      featuredTitle: row.featured_title || row.title,
      aliases: asArray(row.aliases),
      items: asArray(row.items),
      priceFrom: row.price_from || "",
      description: row.description || "",
      accent: row.accent || "#8b5cf6",
      accentRgb: row.accent_rgb || "139, 92, 246",
      watermark: row.watermark || row.title,
      benefits: asArray(row.benefits),
      details: asArray(row.details),
      guarantee: row.guarantee || "",
      prices: asArray(row.prices),
      regions: asArray(row.regions)
    };
  }

  async function loadProducts() {
    var fallback = window.VSTORE_PRODUCTS || [];

    if (
      !window.supabase ||
      !window.VSTORE_SUPABASE_URL ||
      !window.VSTORE_SUPABASE_ANON_KEY
    ) {
      return fallback;
    }

    try {
      var client = window.supabase.createClient(
        window.VSTORE_SUPABASE_URL,
        window.VSTORE_SUPABASE_ANON_KEY
      );
      var result = await client
        .from("products")
        .select("*")
        .eq("active", true)
        .order("sort_order", { ascending: true })
        .order("title", { ascending: true });

      if (result.error) throw result.error;
      if (Array.isArray(result.data) && result.data.length) {
        window.VSTORE_PRODUCTS = result.data.map(mapProduct);
      }
    } catch (error) {
      console.warn("Vstore Supabase fallback:", error);
    }

    return window.VSTORE_PRODUCTS || fallback;
  }

  window.VSTORE_PRODUCTS_READY = loadProducts();
})();
