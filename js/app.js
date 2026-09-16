/**
 * KrushiMitra - Main Application Logic
 * Full functionality: Category filtering, Search with voice mockup,
 * Shopping cart, Wishlist, Order tracking, Soil test booking, KCC EMI calculator,
 * Location modal, Multi-language translations (EN, HI, MR), and Checkout.
 */

document.addEventListener("DOMContentLoaded", () => {
  // State variables with LocalStorage persistence
  let cart = JSON.parse(localStorage.getItem("krushimitra_cart")) || [];
  let wishlist = JSON.parse(localStorage.getItem("krushimitra_wishlist")) || [];
  let orders = JSON.parse(localStorage.getItem("krushimitra_orders")) || [];
  let currentLocation = localStorage.getItem("krushimitra_location") || "Maharashtra (411001)";
  
  let currentCategory = "all";
  let searchQuery = "";
  let maxPrice = 70000;
  let subsidyOnly = false;
  let sortBy = "featured";
  let appliedCoupon = null;
  let currentLang = localStorage.getItem("krushimitra_lang") || "en";

  // Cache Elements
  const productsGrid = document.getElementById("products-grid");
  const flashDealsGrid = document.getElementById("flash-deals-grid");
  const searchInput = document.getElementById("search-input");
  const mobileSearchInput = document.getElementById("mobile-search-input");
  const clearSearchBtn = document.getElementById("clear-search-btn");
  const clearMobileSearchBtn = document.getElementById("clear-mobile-search-btn");
  const priceRange = document.getElementById("price-range");
  const priceRangeVal = document.getElementById("price-range-val");
  const subsidyFilter = document.getElementById("subsidy-filter");
  const sortSelect = document.getElementById("sort-select");
  const activeCountBadge = document.getElementById("active-product-count");
  const resetFiltersBtn = document.getElementById("reset-filters-btn");
  const emptyState = document.getElementById("empty-state");

  // Header & Navigation Elements
  const headerLocationDisplay = document.getElementById("header-location-display");
  const mobileLocationDisplay = document.getElementById("mobile-location-display");
  const locationSelectorBtn = document.getElementById("location-selector-btn");
  const wishlistToggleBtn = document.getElementById("wishlist-toggle-btn");
  const wishlistCountBadge = document.getElementById("wishlist-count-badge");
  const langSelect = document.getElementById("lang-select");

  // Cart elements
  const cartDrawer = document.getElementById("cart-drawer");
  const cartOverlay = document.getElementById("cart-overlay");
  const cartToggleBtns = document.querySelectorAll(".cart-toggle-btn");
  const closeCartBtn = document.getElementById("close-cart-btn");
  const cartItemsContainer = document.getElementById("cart-items-container");
  const cartSubtotalEl = document.getElementById("cart-subtotal");
  const cartDiscountEl = document.getElementById("cart-discount");
  const cartShippingEl = document.getElementById("cart-shipping");
  const cartTotalEl = document.getElementById("cart-total");
  const cartCountBadges = document.querySelectorAll(".cart-count-badge");
  const freeShippingBar = document.getElementById("free-shipping-bar");
  const freeShippingText = document.getElementById("free-shipping-text");
  const couponInput = document.getElementById("coupon-input");
  const applyCouponBtn = document.getElementById("apply-coupon-btn");
  const couponMessage = document.getElementById("coupon-message");
  const checkoutBtn = document.getElementById("checkout-btn");

  // Wishlist elements
  const wishlistDrawer = document.getElementById("wishlist-drawer");
  const wishlistOverlay = document.getElementById("wishlist-overlay");
  const closeWishlistBtn = document.getElementById("close-wishlist-btn");
  const wishlistItemsContainer = document.getElementById("wishlist-items-container");
  const wishlistDrawerCount = document.getElementById("wishlist-drawer-count");

  // Modals
  const quickViewModal = document.getElementById("quick-view-modal");
  const quickViewContent = document.getElementById("quick-view-content");
  const closeQuickViewBtn = document.getElementById("close-quick-view-btn");

  const checkoutModal = document.getElementById("checkout-modal");
  const closeCheckoutBtn = document.getElementById("close-checkout-btn");
  const checkoutForm = document.getElementById("checkout-form");
  const orderSuccessContainer = document.getElementById("order-success-container");

  const marketingModal = document.getElementById("marketing-modal");
  const openMarketingBtns = document.querySelectorAll(".open-marketing-modal-btn");
  const closeMarketingBtn = document.getElementById("close-marketing-btn");

  const locationModal = document.getElementById("location-modal");
  const closeLocationBtn = document.getElementById("close-location-btn");
  const locationForm = document.getElementById("location-form");

  const trackModal = document.getElementById("track-order-modal");
  const closeTrackBtn = document.getElementById("close-track-btn");
  const trackOrderForm = document.getElementById("track-order-form");
  const trackTopBtn = document.getElementById("track-order-top-btn");

  const soilModal = document.getElementById("soil-test-modal");
  const closeSoilBtn = document.getElementById("close-soil-btn");
  const soilForm = document.getElementById("soil-test-form");

  const kccModal = document.getElementById("kcc-modal");
  const closeKccBtn = document.getElementById("close-kcc-btn");
  const kccCalcAmount = document.getElementById("kcc-calc-amount");
  const kccEmiResult = document.getElementById("kcc-emi-result");

  const voiceModal = document.getElementById("voice-search-modal");
  const closeVoiceBtn = document.getElementById("close-voice-btn");
  const voiceSearchBtns = document.querySelectorAll(".voice-search-btn");

  // ================= MULTILINGUAL DICTIONARY =================
  const TRANSLATIONS = {
    en: {
      top_banner: "Free Doorstep Delivery on orders above ₹999 | Use code <strong class=\"text-amber-300\">KISAN10</strong> for 10% Extra Off",
      track_order: "Track Order",
      deliver_to: "Deliver to Farm:",
      agro_advisory: "Agro Advisory",
      cart: "Cart",
      cat_all: "All Products",
      cat_seeds: "Seeds (उन्नत बीज)",
      cat_fertilizers: "Fertilizers (खाद)",
      cat_tools: "Farming Tools (कृषि यंत्र)",
      cat_irrigation: "Irrigation (सिंचाई)",
      cat_organic: "Organic (जैविक)",
      cat_solar: "Solar Equipment (सोलर)",
      kusum_calc: "PM-KUSUM 60% Calculator",
      kisan_reviews: "Kisan Reviews",
      hero_badge: "Digital Marketing Special · Kharif & Rabi Mega Harvest Sale",
      hero_desc: "Order certified high-yield seeds, organic fertilizers, modern farming implements, micro-irrigation systems, and <strong>PM-KUSUM 60% subsidized solar pumps</strong> delivered directly to your village farm.",
      btn_explore_catalog: "Explore Farm Catalog",
      btn_check_subsidy: "Check 60% Solar Subsidy",
      metric_villages: "Villages Delivered",
      metric_certified: "ICAR Certified",
      metric_advisory: "Agro-Expert Advisory",
      trust_1_title: "100% Certified",
      trust_1_sub: "ICAR & Govt Lab Tested",
      trust_2_title: "Doorstep Delivery",
      trust_2_sub: "To 40,000+ PIN Codes",
      trust_3_title: "DBT Subsidies",
      trust_3_sub: "PM-KUSUM Assistance",
      trust_4_title: "Cash on Delivery",
      trust_4_sub: "Kisan Credit Card / UPI",
      cat_section_badge: "Browse by Agricultural Category",
      cat_section_title: "Explore Farm Supplies & Solutions",
      view_full_catalog: "View Full Catalog",
      deals_heading: "Limited Time Heavy Discounts",
      catalog_badge: "KrushiMitra Full Marketplace",
      catalog_title: "All Agricultural Products & Supplies",
      refine_products: "Refine Products",
      max_budget: "Max Budget:",
      subsidy_toggle: "DBT Subsidy Eligible Only"
    },
    hi: {
      top_banner: "₹999 से अधिक के ऑर्डर पर मुफ्त होम डिलीवरी | कोड <strong class=\"text-amber-300\">KISAN10</strong> से 10% अतिरिक्त छूट!",
      track_order: "ऑर्डर ट्रैक करें",
      deliver_to: "खेत तक डिलीवरी:",
      agro_advisory: "कृषि सलाहकार",
      cart: "थैला",
      cat_all: "सभी उत्पाद",
      cat_seeds: "उन्नत बीज",
      cat_fertilizers: "उर्वरक एवं खाद",
      cat_tools: "कृषि यंत्र एवं उपकरण",
      cat_irrigation: "सिंचाई उपकरण",
      cat_organic: "जैविक उत्पाद",
      cat_solar: "सौर ऊर्जा उपकरण",
      kusum_calc: "पीएम-कुसुम 60% सब्सिडी कैलकुलेटर",
      kisan_reviews: "किसान अनुभव",
      hero_badge: "विशेष किसान बचत उत्सव · खरीफ व रबी बंपर सेल",
      hero_desc: "प्रमाणित उच्च उपज वाले बीज, जैविक खाद, आधुनिक कृषि यंत्र, ड्रिप सिंचाई और <strong>पीएम-कुसुम 60% सब्सिडी सोलर पंप</strong> सीधे अपने खेत पर मंगाएं।",
      btn_explore_catalog: "कृषि उत्पाद देखें",
      btn_check_subsidy: "60% सोलर सब्सिडी जांचें",
      metric_villages: "गांवों में सेवा",
      metric_certified: "ICAR प्रमाणित गुणवत्ता",
      metric_advisory: "मुफ्त वैज्ञानिक परामर्श",
      trust_1_title: "100% असली उत्पाद",
      trust_1_sub: "सरकारी लैब से प्रमाणित",
      trust_2_title: "खेत तक डिलीवरी",
      trust_2_sub: "40,000+ पिन कोड पर",
      trust_3_title: "सरकारी सब्सिडी",
      trust_3_sub: "पीएम-कुसुम सीधा लाभ",
      trust_4_title: "कैश ऑन डिलीवरी",
      trust_4_sub: "किसान क्रेडिट कार्ड / UPI",
      cat_section_badge: "श्रेणी अनुसार उत्पाद चुनें",
      cat_section_title: "कृषि आपूर्ति एवं आधुनिक समाधान",
      view_full_catalog: "सभी उत्पाद देखें",
      deals_heading: "सीमित समय की भारी छूट",
      catalog_badge: "कृषिमित्र संपूर्ण बाज़ार",
      catalog_title: "सभी कृषि उत्पाद एवं उपकरण",
      refine_products: "उत्पाद फिल्टर करें",
      max_budget: "अधिकतम बजट:",
      subsidy_toggle: "केवल सरकारी सब्सिडी वाले उत्पाद"
    },
    mr: {
      top_banner: "₹999 पेक्षा जास्त खरेदीवर मोफत होम डिलिव्हरी | कोड <strong class=\"text-amber-300\">KISAN10</strong> वापरा!",
      track_order: "ऑर्डर ट्रॅक करा",
      deliver_to: "शेतावर डिलिव्हरी:",
      agro_advisory: "कृषी सल्लागार",
      cart: "खरेदी पिशवी",
      cat_all: "सर्व उत्पादने",
      cat_seeds: "उन्नत बियाणे",
      cat_fertilizers: "खते व सूक्ष्म अन्नद्रव्ये",
      cat_tools: "शेती अवजारे",
      cat_irrigation: "ठिबक व तुषार सिंचन",
      cat_organic: "सेंद्रिय उत्पादने",
      cat_solar: "सौर कृषी पंप",
      kusum_calc: "कुसुम 60% सबसिडी कॅल्क्युलेटर",
      kisan_reviews: "शेतकरी प्रतिक्रिया",
      hero_badge: "शेतकरी महा-बचत उत्सव · खरीप व रब्बी विशेष सेल",
      hero_desc: "प्रमाणित उच्च उत्पादन देणारे बियाणे, सेंद्रिय खते, पॉवर वीडर, ठिबक संच आणि <strong>पीएम-कुसुम 60% अनुदानावर सोलर पंप</strong> थेट आपल्या बांधावर मिळवा.",
      btn_explore_catalog: "उत्पादने पहा",
      btn_check_subsidy: "60% सबसिडी तपासा",
      metric_villages: "गावांमध्ये डिलिव्हरी",
      metric_certified: "ICAR प्रमाणित",
      metric_advisory: "मोफत कृषी सल्ला",
      trust_1_title: "100% खात्रीशीर",
      trust_1_sub: "सरकारी प्रयोगशाळेत तपासलेले",
      trust_2_title: "बांधावर डिलिव्हरी",
      trust_2_sub: "40,000+ पिन कोडवर",
      trust_3_title: "थेट बँक सबसिडी",
      trust_3_sub: "कुसुम योजना मदत",
      trust_4_title: "कॅश ऑन डिलिव्हरी",
      trust_4_sub: "किसान क्रेडिट कार्ड / UPI",
      cat_section_badge: "कृषी श्रेणीनुसार निवडा",
      cat_section_title: "शेती साहित्य आणि आधुनिक अवजारे",
      view_full_catalog: "संपूर्ण कॅटलॉग पहा",
      deals_heading: "मर्यादित कालावधीची विशेष सवलत",
      catalog_badge: "कृषिमित्र संपूर्ण बाजारपेठ",
      catalog_title: "सर्व कृषी उत्पादने आणि साधने",
      refine_products: "फिल्टर निवडा",
      max_budget: "कमाल बजेट:",
      subsidy_toggle: "फक्त सबसिडी पात्र उत्पादने"
    }
  };

  // Apply Language Translations across UI
  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("krushimitra_lang", lang);
    if (langSelect) langSelect.value = lang;

    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) {
        el.innerHTML = dict[key];
      }
    });

    const tagline = document.getElementById("brand-tagline");
    if (tagline) {
      if (lang === "hi") tagline.textContent = "कृषिमित्र · सशक्त किसान, समृद्ध भारत";
      else if (lang === "mr") tagline.textContent = "कृषिमित्र · समृद्ध शेतकरी, प्रगत महाराष्ट्र";
      else tagline.textContent = "KrushiMitra · Empowering Rural Farmers";
    }

    // Re-render products to update any localized elements
    filterAndRenderProducts();
  }

  // Format INR Currency
  function formatINR(amount) {
    return "₹" + Number(amount).toLocaleString("en-IN");
  }

  // Toast Notification
  function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.className = `fixed bottom-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-white font-medium text-sm transition-all duration-300 transform translate-y-4 opacity-0 ${
      type === "success" ? "bg-emerald-800 border-l-4 border-emerald-400" :
      type === "warning" ? "bg-amber-600 border-l-4 border-amber-300" :
      "bg-slate-900 border-l-4 border-emerald-400"
    }`;
    
    let icon = `<i class="fa-solid fa-circle-check text-emerald-300 text-lg"></i>`;
    if (type === "warning") icon = `<i class="fa-solid fa-triangle-exclamation text-amber-200 text-lg"></i>`;
    if (type === "info") icon = `<i class="fa-solid fa-seedling text-green-300 text-lg"></i>`;

    toast.innerHTML = `${icon} <span>${message}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.remove("translate-y-4", "opacity-0");
    }, 50);

    setTimeout(() => {
      toast.classList.add("translate-y-4", "opacity-0");
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  }

  // Location Display Initialization
  function updateLocationDisplay() {
    if (headerLocationDisplay) headerLocationDisplay.textContent = currentLocation;
    if (mobileLocationDisplay) {
      const pinMatch = currentLocation.match(/\d{6}/);
      mobileLocationDisplay.textContent = pinMatch ? pinMatch[0] : "411001";
    }
  }

  // Wishlist Badge update
  function updateWishlistBadge() {
    if (!wishlistCountBadge) return;
    wishlistCountBadge.textContent = wishlist.length;
    if (wishlist.length > 0) {
      wishlistCountBadge.classList.remove("hidden");
    } else {
      wishlistCountBadge.classList.add("hidden");
    }
  }

  // Star Rating Helper
  function renderStars(rating) {
    let stars = "";
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    for (let i = 0; i < full; i++) stars += `<i class="fa-solid fa-star"></i>`;
    if (half) stars += `<i class="fa-solid fa-star-half-stroke"></i>`;
    const empty = 5 - full - (half ? 1 : 0);
    for (let i = 0; i < empty; i++) stars += `<i class="fa-regular fa-star"></i>`;
    return stars;
  }

  // Render Single Product Card
  function createProductCardHTML(product) {
    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    const isWishlisted = wishlist.includes(product.id);
    
    let badgeClass = "badge-bestseller";
    if (product.badgeType === "subsidy") badgeClass = "badge-subsidy";
    else if (product.badgeType === "certified") badgeClass = "badge-certified";
    else if (product.badgeType === "deal") badgeClass = "badge-deal";
    else if (product.badgeType === "hot") badgeClass = "badge-hot";

    return `
      <div class="bg-white rounded-2xl border border-emerald-100/70 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group relative card-hover">
        
        <!-- Badges & Wishlist -->
        <div class="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
          ${product.badge ? `<span class="text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${badgeClass} shadow-sm">${product.badge}</span>` : ""}
          ${product.subsidyEligible ? `<span class="bg-emerald-800 text-emerald-100 text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm"><i class="fa-solid fa-award"></i> DBT Subsidy</span>` : ""}
        </div>

        <button onclick="window.krushiApp.toggleWishlist('${product.id}', this)" class="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur text-slate-400 hover:text-red-500 hover:bg-white flex items-center justify-center shadow-md transition-all cursor-pointer">
          <i class="${isWishlisted ? 'fa-solid text-red-500' : 'fa-regular'} fa-heart text-base"></i>
        </button>

        <!-- Product Image -->
        <div class="relative overflow-hidden aspect-[4/3] bg-slate-50 cursor-pointer" onclick="window.krushiApp.openQuickView('${product.id}')">
          <img 
            src="${product.image}" 
            alt="${product.name}" 
            loading="lazy"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onerror="this.src='https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80'"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
            <button class="bg-white/95 text-emerald-900 font-semibold text-xs px-3.5 py-1.5 rounded-full shadow-lg hover:bg-emerald-700 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer">
              <i class="fa-solid fa-eye text-xs"></i> Quick View / विवरण
            </button>
          </div>
        </div>

        <!-- Product Details -->
        <div class="p-4 flex-1 flex flex-col">
          <div class="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span class="font-medium uppercase tracking-wider text-emerald-700">${product.categoryName}</span>
            <span class="text-slate-400"><i class="fa-solid fa-box text-xs mr-1"></i>${product.unit}</span>
          </div>

          <h3 class="font-semibold text-slate-800 text-sm md:text-base line-clamp-1 group-hover:text-emerald-700 transition-colors" title="${product.name}">
            ${product.name}
          </h3>
          <p class="text-xs text-emerald-600/90 font-medium mb-2.5 truncate">
            ${product.hindiName}
          </p>

          <!-- Ratings -->
          <div class="flex items-center gap-1.5 mb-3 text-xs">
            <div class="flex text-amber-400 text-xs">
              ${renderStars(product.rating)}
            </div>
            <span class="font-bold text-slate-700">${product.rating}</span>
            <span class="text-slate-400">(${product.reviewsCount}+)</span>
          </div>

          <!-- Price & Action -->
          <div class="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
            <div>
              <div class="flex items-baseline gap-2">
                <span class="text-lg font-bold text-slate-900">${formatINR(product.price)}</span>
                <span class="text-xs text-slate-400 line-through">${formatINR(product.originalPrice)}</span>
              </div>
              <span class="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                Save ${discount}%
              </span>
            </div>

            <button 
              onclick="window.krushiApp.addToCart('${product.id}')"
              class="bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-medium text-xs md:text-sm px-3.5 py-2.5 rounded-xl shadow-md hover:shadow-emerald-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
              aria-label="Add to cart"
            >
              <i class="fa-solid fa-cart-shopping"></i>
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Render Flash Deals
  function renderFlashDeals() {
    if (!flashDealsGrid) return;
    const dealProducts = KRUSHI_PRODUCTS.filter(p => p.isDeal);
    flashDealsGrid.innerHTML = dealProducts.map(p => {
      const discount = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
      return `
        <div class="min-w-[280px] md:min-w-[320px] bg-white rounded-2xl border border-red-100 shadow-md p-4 flex flex-col relative overflow-hidden group hover:shadow-xl transition-all">
          <div class="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow">
            <i class="fa-solid fa-bolt"></i> ${discount}% OFF
          </div>
          <div class="aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-slate-100 cursor-pointer" onclick="window.krushiApp.openQuickView('${p.id}')">
            <img src="${p.image}" alt="${p.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
          <span class="text-xs font-bold text-emerald-700 uppercase tracking-wider">${p.categoryName}</span>
          <h4 class="font-semibold text-slate-800 text-sm truncate mt-1">${p.name}</h4>
          <p class="text-xs text-emerald-600 truncate">${p.hindiName}</p>
          
          <div class="flex items-baseline gap-2 my-2">
            <span class="text-xl font-bold text-slate-900">${formatINR(p.price)}</span>
            <span class="text-xs text-slate-400 line-through">${formatINR(p.originalPrice)}</span>
          </div>

          <!-- Stock Progress Bar -->
          <div class="mt-1 mb-3">
            <div class="flex justify-between text-[11px] text-slate-500 mb-1">
              <span>Hurry, almost sold out!</span>
              <span class="font-bold text-red-600">${p.stockCount} left</span>
            </div>
            <div class="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div class="bg-gradient-to-r from-amber-500 to-red-500 h-2 rounded-full" style="width: ${Math.max(15, (p.stockCount / 30) * 100)}%"></div>
            </div>
          </div>

          <button 
            onclick="window.krushiApp.addToCart('${p.id}')"
            class="w-full bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white text-sm font-semibold py-2.5 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <i class="fa-solid fa-cart-plus"></i> Claim Kisan Deal
          </button>
        </div>
      `;
    }).join("");
  }

  // Filter & Render Catalog Products
  function filterAndRenderProducts() {
    let filtered = KRUSHI_PRODUCTS.filter(product => {
      // Category filter
      if (currentCategory !== "all" && product.category !== currentCategory) {
        return false;
      }
      // Price filter
      if (product.price > maxPrice) {
        return false;
      }
      // Subsidy filter
      if (subsidyOnly && !product.subsidyEligible) {
        return false;
      }
      // Search query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesHindi = product.hindiName.toLowerCase().includes(query);
        const matchesCat = product.categoryName.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        if (!matchesName && !matchesHindi && !matchesCat && !matchesDesc) {
          return false;
        }
      }
      return true;
    });

    // Sorting
    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "discount") {
      filtered.sort((a, b) => {
        const discA = (a.originalPrice - a.price) / a.originalPrice;
        const discB = (b.originalPrice - b.price) / b.originalPrice;
        return discB - discA;
      });
    }

    // Update active count
    if (activeCountBadge) {
      activeCountBadge.textContent = `${filtered.length} Items`;
    }

    // Render cards or empty state
    if (filtered.length === 0) {
      productsGrid.innerHTML = "";
      if (emptyState) emptyState.classList.remove("hidden");
    } else {
      if (emptyState) emptyState.classList.add("hidden");
      productsGrid.innerHTML = filtered.map(product => createProductCardHTML(product)).join("");
    }
  }

  // Dedicated Category Switcher (Fixes class collisions)
  function selectCategory(categoryName, shouldScroll = false) {
    currentCategory = categoryName || "all";
    
    // Update catalog tab buttons
    const catalogTabs = document.querySelectorAll(".catalog-tab-btn");
    catalogTabs.forEach(tab => {
      const cat = tab.dataset.category || "all";
      if (cat === currentCategory) {
        tab.className = "catalog-tab-btn bg-emerald-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-md shrink-0 transition cursor-pointer";
      } else {
        tab.className = "catalog-tab-btn bg-white text-slate-700 border border-slate-200 font-medium text-xs px-4 py-2 rounded-xl hover:border-emerald-500 shrink-0 transition cursor-pointer";
      }
    });

    // Re-filter and render
    filterAndRenderProducts();

    if (shouldScroll) {
      const catalogEl = document.getElementById("catalog-section");
      if (catalogEl) {
        catalogEl.scrollIntoView({ behavior: "smooth" });
      }
    }
  }

  // Setup Event Listeners for All Category Buttons
  function setupCategoryButtons() {
    // Catalog tab pills
    document.querySelectorAll(".catalog-tab-btn").forEach(btn => {
      btn.addEventListener("click", () => selectCategory(btn.dataset.category, false));
    });

    // Secondary header navigation
    document.querySelectorAll(".nav-category-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        selectCategory(btn.dataset.category, true);
        const mobileMenu = document.getElementById("mobile-nav-menu");
        if (mobileMenu) mobileMenu.classList.add("hidden");
      });
    });

    // Homepage cards
    document.querySelectorAll(".home-category-card").forEach(card => {
      card.addEventListener("click", () => selectCategory(card.dataset.category, true));
    });
  }

  // Setup Search Listeners with Clear Button
  function setupSearch() {
    function handleSearch(val) {
      searchQuery = val;
      if (searchInput && searchInput.value !== val) searchInput.value = val;
      if (mobileSearchInput && mobileSearchInput.value !== val) mobileSearchInput.value = val;

      if (clearSearchBtn) {
        clearSearchBtn.classList.toggle("hidden", val.length === 0);
      }
      if (clearMobileSearchBtn) {
        clearMobileSearchBtn.classList.toggle("hidden", val.length === 0);
      }
      filterAndRenderProducts();
    }

    if (searchInput) {
      searchInput.addEventListener("input", (e) => handleSearch(e.target.value));
    }
    if (mobileSearchInput) {
      mobileSearchInput.addEventListener("input", (e) => handleSearch(e.target.value));
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener("click", () => handleSearch(""));
    }
    if (clearMobileSearchBtn) {
      clearMobileSearchBtn.addEventListener("click", () => handleSearch(""));
    }
  }

  // Price Slider Listener
  if (priceRange) {
    priceRange.addEventListener("input", (e) => {
      maxPrice = Number(e.target.value);
      if (priceRangeVal) priceRangeVal.textContent = formatINR(maxPrice);
      filterAndRenderProducts();
    });
  }

  // Subsidy Checkbox Listener
  if (subsidyFilter) {
    subsidyFilter.addEventListener("change", (e) => {
      subsidyOnly = e.target.checked;
      filterAndRenderProducts();
    });
  }

  // Sort Dropdown
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      sortBy = e.target.value;
      filterAndRenderProducts();
    });
  }

  // Reset Filters
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener("click", () => {
      searchQuery = "";
      maxPrice = 70000;
      subsidyOnly = false;
      sortBy = "featured";

      if (searchInput) searchInput.value = "";
      if (mobileSearchInput) mobileSearchInput.value = "";
      if (clearSearchBtn) clearSearchBtn.classList.add("hidden");
      if (clearMobileSearchBtn) clearMobileSearchBtn.classList.add("hidden");
      if (priceRange) priceRange.value = 70000;
      if (priceRangeVal) priceRangeVal.textContent = "₹70,000";
      if (subsidyFilter) subsidyFilter.checked = false;
      if (sortSelect) sortSelect.value = "featured";

      selectCategory("all", false);
      showToast("Filters reset to default view.", "info");
    });
  }

  // Flash Deals Countdown Timer
  function startFlashTimer() {
    let timeLeft = 24 * 3600 - 3420;
    const timerHours = document.getElementById("timer-hours");
    const timerMinutes = document.getElementById("timer-minutes");
    const timerSeconds = document.getElementById("timer-seconds");

    setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = timeLeft % 60;

        if (timerHours) timerHours.textContent = String(hours).padStart(2, "0");
        if (timerMinutes) timerMinutes.textContent = String(minutes).padStart(2, "0");
        if (timerSeconds) timerSeconds.textContent = String(seconds).padStart(2, "0");
      }
    }, 1000);
  }

  // ================= CART MANAGEMENT =================

  function saveCart() {
    localStorage.setItem("krushimitra_cart", JSON.stringify(cart));
    updateCartUI();
  }

  function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountBadges.forEach(badge => {
      badge.textContent = totalItems;
      if (totalItems > 0) {
        badge.classList.remove("hidden");
      } else {
        badge.classList.add("hidden");
      }
    });

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="h-full flex flex-col items-center justify-center p-8 text-center">
          <div class="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-3xl mb-4">
            <i class="fa-solid fa-basket-shopping"></i>
          </div>
          <h4 class="text-base font-bold text-slate-800 mb-1">Your Farm Cart is Empty</h4>
          <p class="text-xs text-slate-500 mb-6 max-w-xs">Explore certified seeds, bio-fertilizers, and tools with free rural delivery above ₹999.</p>
          <button onclick="window.krushiApp.toggleCartDrawer(false); document.getElementById('catalog-section').scrollIntoView({behavior:'smooth'})" class="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow cursor-pointer">
            Start Shopping
          </button>
        </div>
      `;
      if (cartSubtotalEl) cartSubtotalEl.textContent = "₹0";
      if (cartDiscountEl) cartDiscountEl.textContent = "₹0";
      if (cartShippingEl) cartShippingEl.textContent = "₹0";
      if (cartTotalEl) cartTotalEl.textContent = "₹0";
      if (freeShippingBar) freeShippingBar.style.width = "0%";
      if (freeShippingText) freeShippingText.textContent = "Add ₹999 worth of items for Free Delivery";
      if (checkoutBtn) {
        checkoutBtn.disabled = true;
        checkoutBtn.classList.add("opacity-50", "cursor-not-allowed");
      }
      return;
    }

    if (checkoutBtn) {
      checkoutBtn.disabled = false;
      checkoutBtn.classList.remove("opacity-50", "cursor-not-allowed");
    }

    // Render Cart Items
    cartItemsContainer.innerHTML = cart.map(item => `
      <div class="flex gap-3 p-3.5 bg-slate-50/80 rounded-xl border border-slate-100 hover:border-emerald-200 transition-colors">
        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg border border-slate-200 bg-white" onerror="this.src='https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80'" />
        <div class="flex-1 flex flex-col justify-between">
          <div>
            <div class="flex justify-between items-start">
              <h5 class="font-semibold text-xs text-slate-800 line-clamp-1">${item.name}</h5>
              <button onclick="window.krushiApp.removeFromCart('${item.id}')" class="text-slate-400 hover:text-red-500 text-xs ml-2 p-1 cursor-pointer">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
            <p class="text-[11px] text-emerald-600 font-medium">${item.unit}</p>
          </div>
          
          <div class="flex justify-between items-center mt-2">
            <span class="text-sm font-bold text-slate-900">${formatINR(item.price * item.quantity)}</span>
            
            <div class="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shadow-xs">
              <button onclick="window.krushiApp.updateQuantity('${item.id}', -1)" class="w-7 h-7 text-slate-600 hover:bg-slate-100 flex items-center justify-center text-xs font-bold transition cursor-pointer">
                <i class="fa-solid fa-minus"></i>
              </button>
              <span class="w-8 text-center text-xs font-bold text-slate-800">${item.quantity}</span>
              <button onclick="window.krushiApp.updateQuantity('${item.id}', 1)" class="w-7 h-7 text-slate-600 hover:bg-slate-100 flex items-center justify-center text-xs font-bold transition cursor-pointer">
                <i class="fa-solid fa-plus"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join("");

    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let shipping = subtotal >= 999 ? 0 : 90;
    
    // Calculate coupon discount
    let discount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.code === "KISAN10") {
        discount = Math.round(subtotal * 0.10);
      } else if (appliedCoupon.code === "AGRI20") {
        discount = subtotal >= 2000 ? Math.round(subtotal * 0.20) : 0;
      } else if (appliedCoupon.code === "SOLAR500") {
        const hasSolar = cart.some(i => i.category === "solar");
        discount = hasSolar ? 500 : 0;
      } else if (appliedCoupon.code === "FIRSTFARMER") {
        discount = Math.round(subtotal * 0.15);
      }
    }

    const total = Math.max(0, subtotal - discount + shipping);

    if (cartSubtotalEl) cartSubtotalEl.textContent = formatINR(subtotal);
    if (cartDiscountEl) cartDiscountEl.textContent = discount > 0 ? `-${formatINR(discount)}` : "₹0";
    if (cartShippingEl) {
      cartShippingEl.textContent = shipping === 0 ? "FREE" : formatINR(shipping);
      cartShippingEl.className = shipping === 0 ? "font-bold text-emerald-600" : "font-semibold text-slate-800";
    }
    if (cartTotalEl) cartTotalEl.textContent = formatINR(total);

    // Free shipping threshold bar (999 INR)
    if (freeShippingBar && freeShippingText) {
      const percentage = Math.min(100, Math.round((subtotal / 999) * 100));
      freeShippingBar.style.width = `${percentage}%`;
      if (subtotal >= 999) {
        freeShippingText.innerHTML = `<span class="text-emerald-700 font-bold"><i class="fa-solid fa-circle-check"></i> Congratulations! You unlocked Free Rural Shipping!</span>`;
      } else {
        const needed = 999 - subtotal;
        freeShippingText.innerHTML = `Add <strong>${formatINR(needed)}</strong> more to get <strong>FREE Rural Delivery</strong>`;
      }
    }
  }

  function toggleCartDrawer(open = true) {
    if (!cartDrawer || !cartOverlay) return;
    if (open) {
      cartOverlay.classList.remove("hidden");
      setTimeout(() => {
        cartOverlay.classList.remove("opacity-0");
        cartDrawer.classList.remove("translate-x-full");
      }, 10);
      document.body.classList.add("overflow-hidden");
    } else {
      cartDrawer.classList.add("translate-x-full");
      cartOverlay.classList.add("opacity-0");
      setTimeout(() => {
        cartOverlay.classList.add("hidden");
        document.body.classList.remove("overflow-hidden");
      }, 300);
    }
  }

  cartToggleBtns.forEach(btn => btn.addEventListener("click", () => toggleCartDrawer(true)));
  if (closeCartBtn) closeCartBtn.addEventListener("click", () => toggleCartDrawer(false));
  if (cartOverlay) cartOverlay.addEventListener("click", () => toggleCartDrawer(false));

  // Coupon Application
  if (applyCouponBtn && couponInput) {
    applyCouponBtn.addEventListener("click", () => {
      const code = couponInput.value.trim().toUpperCase();
      const validCodes = ["KISAN10", "AGRI20", "SOLAR500", "FIRSTFARMER"];
      
      if (!code) {
        showCouponMsg("Please enter a valid coupon code", "text-red-500");
        return;
      }

      if (!validCodes.includes(code)) {
        showCouponMsg("Invalid coupon code. Try KISAN10 or AGRI20", "text-red-500");
        return;
      }

      const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      if (code === "AGRI20" && subtotal < 2000) {
        showCouponMsg("AGRI20 requires minimum order value of ₹2,000", "text-amber-600");
        return;
      }

      if (code === "SOLAR500") {
        const hasSolar = cart.some(i => i.category === "solar");
        if (!hasSolar) {
          showCouponMsg("SOLAR500 applies only to Solar Farming Equipment", "text-amber-600");
          return;
        }
      }

      appliedCoupon = { code };
      showCouponMsg(`Coupon ${code} applied successfully! 🎉`, "text-emerald-600 font-bold");
      showToast(`Coupon ${code} applied!`, "success");
      saveCart();
    });
  }

  function showCouponMsg(msg, colorClass) {
    if (couponMessage) {
      couponMessage.textContent = msg;
      couponMessage.className = `text-xs mt-1.5 ${colorClass}`;
      couponMessage.classList.remove("hidden");
    }
  }

  // ================= WISHLIST MANAGEMENT =================

  function saveWishlist() {
    localStorage.setItem("krushimitra_wishlist", JSON.stringify(wishlist));
    updateWishlistBadge();
    renderWishlist();
  }

  function toggleWishlistDrawer(open = true) {
    if (!wishlistDrawer || !wishlistOverlay) return;
    if (open) {
      renderWishlist();
      wishlistOverlay.classList.remove("hidden");
      setTimeout(() => {
        wishlistOverlay.classList.remove("opacity-0");
        wishlistDrawer.classList.remove("translate-x-full");
      }, 10);
      document.body.classList.add("overflow-hidden");
    } else {
      wishlistDrawer.classList.add("translate-x-full");
      wishlistOverlay.classList.add("opacity-0");
      setTimeout(() => {
        wishlistOverlay.classList.add("hidden");
        document.body.classList.remove("overflow-hidden");
      }, 300);
    }
  }

  if (wishlistToggleBtn) wishlistToggleBtn.addEventListener("click", () => toggleWishlistDrawer(true));
  if (closeWishlistBtn) closeWishlistBtn.addEventListener("click", () => toggleWishlistDrawer(false));
  if (wishlistOverlay) wishlistOverlay.addEventListener("click", () => toggleWishlistDrawer(false));

  function renderWishlist() {
    if (!wishlistItemsContainer) return;
    if (wishlistDrawerCount) wishlistDrawerCount.textContent = wishlist.length;

    if (wishlist.length === 0) {
      wishlistItemsContainer.innerHTML = `
        <div class="h-full flex flex-col items-center justify-center p-8 text-center">
          <div class="w-16 h-16 rounded-full bg-red-50 text-red-400 flex items-center justify-center text-2xl mb-3">
            <i class="fa-regular fa-heart"></i>
          </div>
          <h4 class="text-sm font-bold text-slate-800 mb-1">Your Wishlist is Empty</h4>
          <p class="text-xs text-slate-500 mb-4">Tap the ❤️ heart on seeds, fertilizers, or tools to save them for later purchase.</p>
        </div>
      `;
      return;
    }

    const items = KRUSHI_PRODUCTS.filter(p => wishlist.includes(p.id));
    wishlistItemsContainer.innerHTML = items.map(p => `
      <div class="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 items-center">
        <img src="${p.image}" alt="${p.name}" class="w-14 h-14 object-cover rounded-lg bg-white border border-slate-200" onerror="this.src='https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80'" />
        <div class="flex-1 min-w-0">
          <h5 class="text-xs font-bold text-slate-800 truncate">${p.name}</h5>
          <p class="text-[11px] text-emerald-700 font-semibold">${formatINR(p.price)}</p>
        </div>
        <div class="flex items-center gap-1.5">
          <button onclick="window.krushiApp.addToCart('${p.id}'); window.krushiApp.toggleWishlist('${p.id}')" class="bg-emerald-700 text-white text-xs p-2 rounded-lg hover:bg-emerald-800 transition cursor-pointer" title="Move to Cart">
            <i class="fa-solid fa-cart-arrow-down"></i>
          </button>
          <button onclick="window.krushiApp.toggleWishlist('${p.id}')" class="text-slate-400 hover:text-red-500 text-xs p-2 cursor-pointer" title="Remove">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    `).join("");
  }

  // ================= QUICK VIEW MODAL =================

  function openQuickView(productId) {
    const product = KRUSHI_PRODUCTS.find(p => p.id === productId);
    if (!product || !quickViewModal || !quickViewContent) return;

    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

    quickViewContent.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        <!-- Image & Gallery -->
        <div class="flex flex-col">
          <div class="aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm relative">
            <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80'" />
            <span class="absolute top-3 left-3 bg-emerald-700 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
              ${product.categoryName}
            </span>
            ${product.subsidyEligible ? `<span class="absolute top-3 right-3 bg-blue-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow"><i class="fa-solid fa-award"></i> DBT Subsidy</span>` : ""}
          </div>
          <div class="flex items-center gap-2 mt-3 text-xs text-slate-500 justify-center">
            <i class="fa-solid fa-shield-halved text-emerald-600"></i> 100% Genuine Certified Agri Product
          </div>
        </div>

        <!-- Details -->
        <div class="flex flex-col">
          <div class="flex items-center gap-2 mb-1">
            <div class="flex text-amber-400 text-xs">
              ${renderStars(product.rating)}
            </div>
            <span class="text-xs font-bold text-slate-700">${product.rating}</span>
            <span class="text-xs text-slate-400">(${product.reviewsCount} verified farmer reviews)</span>
          </div>

          <h2 class="text-xl md:text-2xl font-bold text-slate-900 leading-tight mb-1 font-heading">${product.name}</h2>
          <p class="text-sm font-semibold text-emerald-700 mb-4">${product.hindiName}</p>

          <!-- Price section -->
          <div class="bg-emerald-50/70 border border-emerald-100 p-3.5 rounded-xl mb-4 flex items-center justify-between">
            <div>
              <div class="flex items-baseline gap-2.5">
                <span class="text-2xl font-extrabold text-slate-900">${formatINR(product.price)}</span>
                <span class="text-sm text-slate-400 line-through">${formatINR(product.originalPrice)}</span>
              </div>
              <p class="text-xs text-slate-500">Unit: <span class="font-bold text-slate-700">${product.unit}</span> (Taxes Included)</p>
            </div>
            <span class="bg-emerald-700 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
              ${discount}% OFF
            </span>
          </div>

          <!-- Description -->
          <p class="text-xs md:text-sm text-slate-600 mb-4 leading-relaxed">${product.description}</p>

          <!-- Key Benefits -->
          <div class="mb-4">
            <h4 class="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <i class="fa-solid fa-seedling text-emerald-600"></i> Key Farmer Benefits:
            </h4>
            <ul class="space-y-1.5">
              ${product.benefits.map(b => `<li class="text-xs text-slate-600 flex items-start gap-2"><i class="fa-solid fa-check text-emerald-600 mt-0.5 text-xs"></i> <span>${b}</span></li>`).join("")}
            </ul>
          </div>

          <!-- Usage Instructions -->
          <div class="bg-slate-50 border border-slate-200/80 p-3 rounded-xl mb-6 text-xs text-slate-600">
            <strong class="text-slate-800 flex items-center gap-1.5 mb-1"><i class="fa-solid fa-circle-info text-blue-600"></i> Recommended Usage / प्रयोग विधि:</strong>
            ${product.usage}
          </div>

          <!-- Add to Cart Action -->
          <div class="flex items-center gap-3 mt-auto pt-2">
            <div class="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white">
              <button onclick="window.krushiApp.adjustQuickViewQty(-1)" class="w-10 h-11 text-slate-700 hover:bg-slate-100 flex items-center justify-center font-bold cursor-pointer">
                <i class="fa-solid fa-minus text-xs"></i>
              </button>
              <input id="quick-view-qty" type="number" value="1" min="1" max="50" class="w-12 text-center text-sm font-bold text-slate-800 focus:outline-none" readonly />
              <button onclick="window.krushiApp.adjustQuickViewQty(1)" class="w-10 h-11 text-slate-700 hover:bg-slate-100 flex items-center justify-center font-bold cursor-pointer">
                <i class="fa-solid fa-plus text-xs"></i>
              </button>
            </div>

            <button 
              onclick="window.krushiApp.addQuickViewToCart('${product.id}')"
              class="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm py-3 px-6 rounded-xl shadow-lg hover:shadow-emerald-700/30 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
            >
              <i class="fa-solid fa-cart-shopping"></i> Add to Farm Cart
            </button>
          </div>
        </div>
      </div>
    `;

    quickViewModal.classList.remove("hidden");
    setTimeout(() => {
      quickViewModal.classList.remove("opacity-0");
      quickViewModal.querySelector(".modal-card")?.classList.remove("scale-95");
    }, 10);
    document.body.classList.add("overflow-hidden");
  }

  function closeQuickView() {
    if (!quickViewModal) return;
    quickViewModal.classList.add("opacity-0");
    quickViewModal.querySelector(".modal-card")?.classList.add("scale-95");
    setTimeout(() => {
      quickViewModal.classList.add("hidden");
      document.body.classList.remove("overflow-hidden");
    }, 250);
  }

  if (closeQuickViewBtn) closeQuickViewBtn.addEventListener("click", closeQuickView);
  if (quickViewModal) {
    quickViewModal.addEventListener("click", (e) => {
      if (e.target === quickViewModal) closeQuickView();
    });
  }

  // ================= CHECKOUT WORKFLOW =================

  function openCheckout() {
    if (cart.length === 0) return;
    toggleCartDrawer(false);

    if (checkoutModal) {
      checkoutModal.classList.remove("hidden");
      setTimeout(() => {
        checkoutModal.classList.remove("opacity-0");
        checkoutModal.querySelector(".modal-card")?.classList.remove("scale-95");
      }, 10);
      document.body.classList.add("overflow-hidden");

      // Populate checkout summary
      const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      let shipping = subtotal >= 999 ? 0 : 90;
      let discount = 0;
      if (appliedCoupon) {
        if (appliedCoupon.code === "KISAN10") discount = Math.round(subtotal * 0.10);
        else if (appliedCoupon.code === "AGRI20") discount = Math.round(subtotal * 0.20);
        else if (appliedCoupon.code === "SOLAR500") discount = 500;
        else if (appliedCoupon.code === "FIRSTFARMER") discount = Math.round(subtotal * 0.15);
      }
      const total = Math.max(0, subtotal - discount + shipping);

      const checkoutSubtotal = document.getElementById("checkout-subtotal");
      const checkoutDiscount = document.getElementById("checkout-discount");
      const checkoutShipping = document.getElementById("checkout-shipping");
      const checkoutTotal = document.getElementById("checkout-total");

      if (checkoutSubtotal) checkoutSubtotal.textContent = formatINR(subtotal);
      if (checkoutDiscount) checkoutDiscount.textContent = discount > 0 ? `-${formatINR(discount)}` : "₹0";
      if (checkoutShipping) checkoutShipping.textContent = shipping === 0 ? "FREE" : formatINR(shipping);
      if (checkoutTotal) checkoutTotal.textContent = formatINR(total);
    }
  }

  if (checkoutBtn) checkoutBtn.addEventListener("click", openCheckout);
  if (closeCheckoutBtn) closeCheckoutBtn.addEventListener("click", closeCheckout);
  if (checkoutModal) {
    checkoutModal.addEventListener("click", (e) => {
      if (e.target === checkoutModal) closeCheckout();
    });
  }

  function closeCheckout() {
    if (!checkoutModal) return;
    checkoutModal.classList.add("opacity-0");
    checkoutModal.querySelector(".modal-card")?.classList.add("scale-95");
    setTimeout(() => {
      checkoutModal.classList.add("hidden");
      document.body.classList.remove("overflow-hidden");
      if (orderSuccessContainer) orderSuccessContainer.classList.add("hidden");
      if (checkoutForm) checkoutForm.classList.remove("hidden");
    }, 250);
  }

  // Handle PIN Code auto fill
  const pinInput = document.getElementById("checkout-pincode");
  const districtStateInput = document.getElementById("checkout-district");
  if (pinInput && districtStateInput) {
    pinInput.addEventListener("input", (e) => {
      const val = e.target.value.trim();
      if (val.length === 6) {
        if (val.startsWith("14")) districtStateInput.value = "Ludhiana District, Punjab";
        else if (val.startsWith("45")) districtStateInput.value = "Indore District, Madhya Pradesh";
        else if (val.startsWith("38")) districtStateInput.value = "Anand District, Gujarat";
        else if (val.startsWith("32")) districtStateInput.value = "Kota District, Rajasthan";
        else if (val.startsWith("22")) districtStateInput.value = "Lucknow District, Uttar Pradesh";
        else districtStateInput.value = "Pune District, Maharashtra (Hub: Baramati)";
        districtStateInput.classList.add("border-emerald-500", "bg-emerald-50/40");
      }
    });
  }

  // Handle Order Form Submission
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const farmerName = document.getElementById("checkout-name")?.value || "Kisan Mitra";
      const farmerPhone = document.getElementById("checkout-phone")?.value || "9876543210";
      const farmerVillage = document.getElementById("checkout-village")?.value || "Krushi Gram";
      const paymentMethod = document.querySelector('input[name="payment-method"]:checked')?.value || "COD";
      const orderId = "KM-2026-" + Math.floor(100000 + Math.random() * 900000);
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 3);

      const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      let shipping = subtotal >= 999 ? 0 : 90;
      let discount = 0;
      if (appliedCoupon) {
        if (appliedCoupon.code === "KISAN10") discount = Math.round(subtotal * 0.10);
        else if (appliedCoupon.code === "AGRI20") discount = Math.round(subtotal * 0.20);
        else if (appliedCoupon.code === "SOLAR500") discount = 500;
        else if (appliedCoupon.code === "FIRSTFARMER") discount = Math.round(subtotal * 0.15);
      }
      const total = Math.max(0, subtotal - discount + shipping);

      // Save order to history
      orders.unshift({
        id: orderId,
        date: new Date().toISOString(),
        name: farmerName,
        phone: farmerPhone,
        address: `${farmerVillage}, ${districtStateInput?.value || "Maharashtra"}`,
        payment: paymentMethod,
        total: total,
        items: [...cart]
      });
      localStorage.setItem("krushimitra_orders", JSON.stringify(orders));

      // Render Order Confirmation & Printable Invoice
      if (orderSuccessContainer) {
        checkoutForm.classList.add("hidden");
        orderSuccessContainer.classList.remove("hidden");
        orderSuccessContainer.innerHTML = `
          <div id="printable-receipt" class="p-6 md:p-8 flex flex-col items-center text-center">
            <div class="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mb-3 shadow-inner">
              <i class="fa-solid fa-check"></i>
            </div>
            <span class="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-2">Order Confirmed / आदेश स्वीकृत</span>
            <h3 class="text-xl md:text-2xl font-bold text-slate-800 mb-1">धन्यवाद, ${farmerName} जी!</h3>
            <p class="text-xs text-slate-500 mb-6">Your order has been placed. SMS confirmation sent to +91 ${farmerPhone}.</p>

            <!-- Order Invoice Card -->
            <div class="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left text-xs mb-6 space-y-3">
              <div class="flex justify-between border-b border-slate-200 pb-2">
                <span class="text-slate-500">Order ID:</span>
                <span class="font-mono font-bold text-slate-800">${orderId}</span>
              </div>
              <div class="flex justify-between border-b border-slate-200 pb-2">
                <span class="text-slate-500">Estimated Delivery:</span>
                <span class="font-bold text-emerald-700">${deliveryDate.toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })} (Direct to Farm)</span>
              </div>
              <div class="flex justify-between border-b border-slate-200 pb-2">
                <span class="text-slate-500">Delivery Address:</span>
                <span class="font-medium text-slate-800 text-right max-w-[200px]">${farmerVillage}, ${districtStateInput?.value || "Maharashtra"}</span>
              </div>
              <div class="flex justify-between border-b border-slate-200 pb-2">
                <span class="text-slate-500">Payment Option:</span>
                <span class="font-bold text-slate-800 uppercase">${paymentMethod}</span>
              </div>
              <div class="pt-2">
                <span class="font-bold text-slate-700 block mb-2">Order Items (${cart.length}):</span>
                <div class="space-y-1 max-h-36 overflow-y-auto pr-1">
                  ${cart.map(i => `
                    <div class="flex justify-between text-slate-600">
                      <span class="truncate max-w-[180px]">${i.quantity}x ${i.name}</span>
                      <span class="font-semibold text-slate-800">${formatINR(i.price * i.quantity)}</span>
                    </div>
                  `).join("")}
                </div>
              </div>
              <div class="border-t border-slate-300 pt-2 flex justify-between font-bold text-sm text-slate-900">
                <span>Grand Total:</span>
                <span class="text-emerald-800 text-base">${formatINR(total)}</span>
              </div>
            </div>

            <!-- Receipt Actions -->
            <div class="flex flex-col sm:flex-row gap-3 w-full no-print">
              <button onclick="window.print()" class="flex-1 bg-white border border-emerald-700 text-emerald-800 hover:bg-emerald-50 text-xs font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer">
                <i class="fa-solid fa-print"></i> Print Receipt / रसीद
              </button>
              <button onclick="window.krushiApp.finishOrder()" class="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold py-3 rounded-xl shadow transition flex items-center justify-center gap-2 cursor-pointer">
                <i class="fa-solid fa-bag-shopping"></i> Continue Shopping
              </button>
            </div>
          </div>
        `;
      }

      // Clear Cart
      cart = [];
      appliedCoupon = null;
      saveCart();
      showToast(`Order ${orderId} placed successfully!`, "success");
    });
  }

  // ================= MARKETING PROJECT MODAL =================

  openMarketingBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      if (!marketingModal) return;
      marketingModal.classList.remove("hidden");
      setTimeout(() => {
        marketingModal.classList.remove("opacity-0");
        marketingModal.querySelector(".modal-card")?.classList.remove("scale-95");
      }, 10);
      document.body.classList.add("overflow-hidden");
    });
  });

  if (closeMarketingBtn) {
    closeMarketingBtn.addEventListener("click", () => {
      if (!marketingModal) return;
      marketingModal.classList.add("opacity-0");
      marketingModal.querySelector(".modal-card")?.classList.add("scale-95");
      setTimeout(() => {
        marketingModal.classList.add("hidden");
        document.body.classList.remove("overflow-hidden");
      }, 250);
    });
  }

  // ================= LOCATION SELECTOR MODAL =================

  function openLocationModal() {
    if (!locationModal) return;
    locationModal.classList.remove("hidden");
    setTimeout(() => {
      locationModal.classList.remove("opacity-0");
      locationModal.querySelector(".modal-card")?.classList.remove("scale-95");
    }, 10);
    document.body.classList.add("overflow-hidden");
  }

  function closeLocationModal() {
    if (!locationModal) return;
    locationModal.classList.add("opacity-0");
    locationModal.querySelector(".modal-card")?.classList.add("scale-95");
    setTimeout(() => {
      locationModal.classList.add("hidden");
      document.body.classList.remove("overflow-hidden");
    }, 250);
  }

  if (locationSelectorBtn) locationSelectorBtn.addEventListener("click", openLocationModal);
  if (closeLocationBtn) closeLocationBtn.addEventListener("click", closeLocationModal);
  if (locationModal) {
    locationModal.addEventListener("click", (e) => {
      if (e.target === locationModal) closeLocationModal();
    });
  }

  if (locationForm) {
    locationForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const pin = document.getElementById("modal-pincode-input")?.value.trim();
      if (pin && pin.length === 6) {
        let locName = `PIN ${pin}`;
        if (pin.startsWith("14")) locName = `Punjab (${pin})`;
        else if (pin.startsWith("45")) locName = `Madhya Pradesh (${pin})`;
        else if (pin.startsWith("38")) locName = `Gujarat (${pin})`;
        else if (pin.startsWith("32")) locName = `Rajasthan (${pin})`;
        else if (pin.startsWith("22")) locName = `Uttar Pradesh (${pin})`;
        else locName = `Maharashtra (${pin})`;

        currentLocation = locName;
        localStorage.setItem("krushimitra_location", locName);
        updateLocationDisplay();
        closeLocationModal();
        showToast(`Farm delivery set to ${locName}`, "success");
      }
    });
  }

  // ================= ORDER TRACKING MODAL =================

  function openTrackModal() {
    if (!trackModal) return;
    trackModal.classList.remove("hidden");
    setTimeout(() => {
      trackModal.classList.remove("opacity-0");
      trackModal.querySelector(".modal-card")?.classList.remove("scale-95");
    }, 10);
    document.body.classList.add("overflow-hidden");

    // Pre-fill with recent order ID if any
    const trackInput = document.getElementById("track-order-input");
    if (trackInput && orders.length > 0) {
      trackInput.value = orders[0].id;
      const trackIdDisplay = document.getElementById("track-id-display");
      if (trackIdDisplay) trackIdDisplay.textContent = orders[0].id;
    }
  }

  function closeTrackModal() {
    if (!trackModal) return;
    trackModal.classList.add("opacity-0");
    trackModal.querySelector(".modal-card")?.classList.add("scale-95");
    setTimeout(() => {
      trackModal.classList.add("hidden");
      document.body.classList.remove("overflow-hidden");
    }, 250);
  }

  if (trackTopBtn) trackTopBtn.addEventListener("click", openTrackModal);
  if (closeTrackBtn) closeTrackBtn.addEventListener("click", closeTrackModal);
  if (trackModal) {
    trackModal.addEventListener("click", (e) => {
      if (e.target === trackModal) closeTrackModal();
    });
  }

  if (trackOrderForm) {
    trackOrderForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const val = document.getElementById("track-order-input")?.value.trim();
      if (val) {
        const trackIdDisplay = document.getElementById("track-id-display");
        if (trackIdDisplay) trackIdDisplay.textContent = val;
        showToast(`Found live tracking details for ${val}`, "success");
      }
    });
  }

  // ================= SOIL TESTING REQUEST MODAL =================

  function openSoilTestModal() {
    if (!soilModal) return;
    soilModal.classList.remove("hidden");
    setTimeout(() => {
      soilModal.classList.remove("opacity-0");
      soilModal.querySelector(".modal-card")?.classList.remove("scale-95");
    }, 10);
    document.body.classList.add("overflow-hidden");
  }

  function closeSoilTestModal() {
    if (!soilModal) return;
    soilModal.classList.add("opacity-0");
    soilModal.querySelector(".modal-card")?.classList.add("scale-95");
    setTimeout(() => {
      soilModal.classList.add("hidden");
      document.body.classList.remove("overflow-hidden");
    }, 250);
  }

  if (closeSoilBtn) closeSoilBtn.addEventListener("click", closeSoilTestModal);
  if (soilModal) {
    soilModal.addEventListener("click", (e) => {
      if (e.target === soilModal) closeSoilTestModal();
    });
  }

  if (soilForm) {
    soilForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const refId = "SOIL-2026-" + Math.floor(1000 + Math.random() * 9000);
      closeSoilTestModal();
      showToast(`Soil Sample Pickup Scheduled! Reference ID: ${refId}`, "success");
      soilForm.reset();
    });
  }

  // ================= KCC 0% EMI MODAL =================

  function openKccModal() {
    if (!kccModal) return;
    kccModal.classList.remove("hidden");
    setTimeout(() => {
      kccModal.classList.remove("opacity-0");
      kccModal.querySelector(".modal-card")?.classList.remove("scale-95");
    }, 10);
    document.body.classList.add("overflow-hidden");
    updateKccEmi();
  }

  function closeKccModal() {
    if (!kccModal) return;
    kccModal.classList.add("opacity-0");
    kccModal.querySelector(".modal-card")?.classList.add("scale-95");
    setTimeout(() => {
      kccModal.classList.add("hidden");
      document.body.classList.remove("overflow-hidden");
    }, 250);
  }

  function updateKccEmi() {
    if (!kccCalcAmount || !kccEmiResult) return;
    const val = parseFloat(kccCalcAmount.value) || 12000;
    const monthly = Math.round(val / 6);
    kccEmiResult.textContent = `₹${monthly.toLocaleString("en-IN")} / month`;
  }

  if (closeKccBtn) closeKccBtn.addEventListener("click", closeKccModal);
  if (kccCalcAmount) kccCalcAmount.addEventListener("input", updateKccEmi);
  if (kccModal) {
    kccModal.addEventListener("click", (e) => {
      if (e.target === kccModal) closeKccModal();
    });
  }

  // ================= VOICE SEARCH MODAL =================

  function openVoiceModal() {
    if (!voiceModal) return;
    voiceModal.classList.remove("hidden");
    setTimeout(() => {
      voiceModal.classList.remove("opacity-0");
      voiceModal.querySelector(".modal-card")?.classList.remove("scale-95");
    }, 10);
    document.body.classList.add("overflow-hidden");
  }

  function closeVoiceModal() {
    if (!voiceModal) return;
    voiceModal.classList.add("opacity-0");
    voiceModal.querySelector(".modal-card")?.classList.add("scale-95");
    setTimeout(() => {
      voiceModal.classList.add("hidden");
      document.body.classList.remove("overflow-hidden");
    }, 250);
  }

  voiceSearchBtns.forEach(btn => btn.addEventListener("click", openVoiceModal));
  if (closeVoiceBtn) closeVoiceBtn.addEventListener("click", closeVoiceModal);
  if (voiceModal) {
    voiceModal.addEventListener("click", (e) => {
      if (e.target === voiceModal) closeVoiceModal();
    });
  }

  // ================= SOLAR PUMP SUBSIDY CALCULATOR =================

  const solarPumpSize = document.getElementById("subsidy-pump-size");
  const solarState = document.getElementById("subsidy-state");
  const subsidyTotalCost = document.getElementById("subsidy-total-cost");
  const subsidyGovtAmount = document.getElementById("subsidy-govt-amount");
  const subsidyFarmerShare = document.getElementById("subsidy-farmer-share");
  const subsidyMonthlySaving = document.getElementById("subsidy-monthly-saving");

  function calculateSolarSubsidy() {
    if (!solarPumpSize || !subsidyTotalCost) return;
    const hp = solarPumpSize.value;
    let baseCost = 135000;
    let dieselSaving = 5500;

    if (hp === "3") {
      baseCost = 95000;
      dieselSaving = 3200;
    } else if (hp === "5") {
      baseCost = 135000;
      dieselSaving = 5500;
    } else if (hp === "7.5") {
      baseCost = 195000;
      dieselSaving = 8200;
    }

    const govtShare = Math.round(baseCost * 0.60);
    const farmerShare = baseCost - govtShare;

    subsidyTotalCost.textContent = formatINR(baseCost);
    subsidyGovtAmount.textContent = formatINR(govtShare);
    subsidyFarmerShare.textContent = formatINR(farmerShare);
    if (subsidyMonthlySaving) subsidyMonthlySaving.textContent = `${formatINR(dieselSaving)}/month`;
  }

  if (solarPumpSize) solarPumpSize.addEventListener("change", calculateSolarSubsidy);
  if (solarState) solarState.addEventListener("change", calculateSolarSubsidy);

  // ================= SIMULATED SOCIAL PROOF TOAST =================

  const socialProofMessages = [
    { name: "Suresh Patil", location: "Nashik, MH", item: "JalDhara 1-Acre Drip Kit", time: "3 mins ago" },
    { name: "Gurdeep Singh", location: "Ludhiana, PB", item: "Surya Sharbati Wheat Seeds", time: "7 mins ago" },
    { name: "Rameshwar Rao", location: "Guntur, AP", item: "Kaveri Hybrid Cotton Seeds", time: "12 mins ago" },
    { name: "Balram Patel", location: "Indore, MP", item: "5HP Solar Water Pump (PM-KUSUM)", time: "18 mins ago" },
    { name: "Dnyaneshwar Shinde", location: "Kolhapur, MH", item: "Bio-NPK Liquid Consortium", time: "25 mins ago" },
    { name: "Devendra Choudhary", location: "Kota, RJ", item: "NeemShield 10,000 PPM Bio-Pesticide", time: "32 mins ago" }
  ];

  let socialProofIdx = 0;
  const socialToastContainer = document.getElementById("social-proof-toast");

  function triggerSocialProof() {
    if (!socialToastContainer) return;
    const data = socialProofMessages[socialProofIdx % socialProofMessages.length];
    socialProofIdx++;

    socialToastContainer.innerHTML = `
      <div class="bg-white/95 backdrop-blur border border-emerald-200 rounded-2xl shadow-xl p-3 max-w-xs flex items-center gap-3 social-proof-toast">
        <div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0">
          <i class="fa-solid fa-bag-shopping"></i>
        </div>
        <div class="flex-1 text-xs">
          <p class="font-bold text-slate-800 leading-tight">${data.name} <span class="text-[11px] font-normal text-slate-400">(${data.location})</span></p>
          <p class="text-emerald-700 font-medium truncate">Ordered ${data.item}</p>
          <span class="text-[10px] text-slate-400">${data.time} · Verified Kisan</span>
        </div>
        <button onclick="document.getElementById('social-proof-toast').classList.add('hidden')" class="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
          <i class="fa-solid fa-xmark text-xs"></i>
        </button>
      </div>
    `;
    socialToastContainer.classList.remove("hidden");

    setTimeout(() => {
      socialToastContainer.classList.add("hidden");
    }, 6000);
  }

  setTimeout(triggerSocialProof, 4000);
  setInterval(triggerSocialProof, 22000);

  // ================= LANGUAGE TOGGLE =================

  if (langSelect) {
    langSelect.addEventListener("change", (e) => {
      applyLanguage(e.target.value);
      showToast(`Language set to ${e.target.value.toUpperCase()}`, "info");
    });
  }

  // ================= NEWSLETTER SUBSCRIPTION =================

  const newsletterForm = document.getElementById("newsletter-form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const mobileOrEmail = document.getElementById("newsletter-input")?.value;
      if (mobileOrEmail) {
        showToast("Success! Welcome coupon KISAN10 activated for " + mobileOrEmail, "success");
        newsletterForm.reset();
      }
    });
  }

  // ================= MOBILE HAMBURGER MENU =================

  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  const mobileNavMenu = document.getElementById("mobile-nav-menu");
  if (mobileMenuToggle && mobileNavMenu) {
    mobileMenuToggle.addEventListener("click", () => {
      mobileNavMenu.classList.toggle("hidden");
    });
  }

  // ================= EXPOSE GLOBAL ACTIONS =================

  window.krushiApp = {
    addToCart(productId, qty = 1) {
      const product = KRUSHI_PRODUCTS.find(p => p.id === productId);
      if (!product) return;

      const existing = cart.find(item => item.id === productId);
      if (existing) {
        existing.quantity += qty;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          hindiName: product.hindiName,
          category: product.category,
          price: product.price,
          unit: product.unit,
          image: product.image,
          quantity: qty
        });
      }
      saveCart();
      showToast(`Added ${qty}x ${product.name} to Farm Cart! 🛒`);
    },

    removeFromCart(productId) {
      cart = cart.filter(item => item.id !== productId);
      saveCart();
      showToast("Item removed from cart.", "info");
    },

    updateQuantity(productId, delta) {
      const item = cart.find(i => i.id === productId);
      if (!item) return;
      item.quantity += delta;
      if (item.quantity <= 0) {
        this.removeFromCart(productId);
      } else {
        saveCart();
      }
    },

    toggleCartDrawer(open) {
      toggleCartDrawer(open);
    },

    toggleWishlist(productId, btnEl) {
      const idx = wishlist.indexOf(productId);
      if (idx > -1) {
        wishlist.splice(idx, 1);
        showToast("Removed from Saved Wishlist.");
      } else {
        wishlist.push(productId);
        showToast("Added to Saved Wishlist! ❤️");
      }
      saveWishlist();

      // Update icon on page if provided
      if (btnEl) {
        const icon = btnEl.querySelector("i");
        if (icon) {
          icon.className = wishlist.includes(productId) ? "fa-solid fa-heart text-base text-red-500" : "fa-regular fa-heart text-base";
        }
      } else {
        filterAndRenderProducts();
      }
    },

    openWishlist() {
      toggleWishlistDrawer(true);
    },

    moveAllWishlistToCart() {
      if (wishlist.length === 0) return;
      wishlist.forEach(id => {
        const prod = KRUSHI_PRODUCTS.find(p => p.id === id);
        if (prod) {
          const existing = cart.find(i => i.id === id);
          if (existing) existing.quantity += 1;
          else cart.push({ ...prod, quantity: 1 });
        }
      });
      wishlist = [];
      saveWishlist();
      saveCart();
      toggleWishlistDrawer(false);
      toggleCartDrawer(true);
      showToast("All wishlist items moved to cart! 🛒", "success");
    },

    clearWishlist() {
      wishlist = [];
      saveWishlist();
      showToast("Wishlist cleared.", "info");
    },

    selectCategory(cat, shouldScroll) {
      selectCategory(cat, shouldScroll);
    },

    openQuickView(productId) {
      openQuickView(productId);
    },

    adjustQuickViewQty(delta) {
      const qtyInput = document.getElementById("quick-view-qty");
      if (!qtyInput) return;
      let val = parseInt(qtyInput.value) || 1;
      val = Math.max(1, Math.min(50, val + delta));
      qtyInput.value = val;
    },

    addQuickViewToCart(productId) {
      const qtyInput = document.getElementById("quick-view-qty");
      const qty = qtyInput ? (parseInt(qtyInput.value) || 1) : 1;
      this.addToCart(productId, qty);
      closeQuickView();
      toggleCartDrawer(true);
    },

    openLocationModal() {
      openLocationModal();
    },

    selectLocationPreset(loc, hub) {
      currentLocation = loc;
      localStorage.setItem("krushimitra_location", loc);
      updateLocationDisplay();
      closeLocationModal();
      showToast(`Farm delivery set to ${loc} (${hub})`, "success");
    },

    openTrackModal() {
      openTrackModal();
    },

    openSoilTestModal() {
      openSoilTestModal();
    },

    openKccModal() {
      openKccModal();
    },

    applyVoiceQuery(query) {
      closeVoiceModal();
      if (searchInput) searchInput.value = query;
      if (mobileSearchInput) mobileSearchInput.value = query;
      searchQuery = query;
      if (clearSearchBtn) clearSearchBtn.classList.remove("hidden");
      if (clearMobileSearchBtn) clearMobileSearchBtn.classList.remove("hidden");
      filterAndRenderProducts();
      showToast(`Filtered for voice query: "${query}"`, "success");
      const catSection = document.getElementById("catalog-section");
      if (catSection) catSection.scrollIntoView({ behavior: "smooth" });
    },

    finishOrder() {
      closeCheckout();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Initializations
  setupCategoryButtons();
  setupSearch();
  renderFlashDeals();
  filterAndRenderProducts();
  updateCartUI();
  updateWishlistBadge();
  updateLocationDisplay();
  startFlashTimer();
  calculateSolarSubsidy();
  if (currentLang !== "en") applyLanguage(currentLang);
});
