/* =====================================================================
   Doces do Léo — site do cliente
   Cardápio, estoque, promoções e status da loja vêm do Firestore.
   O painel administrativo (admin.html) é quem edita esses dados.
   ===================================================================== */

/* ================= CONFIG PADRÃO (usada até o Firestore carregar) ================= */
let STORE_INFO = {
    whatsappNumber: "5546999266860",
    address: "Dois Vizinhos - PR",
    pickupEstimate: "15–30 minutos",
    deliveryEstimate: "30–60 minutos",
    minOrder: 10,
    shippingFee: 10,
    cashbackAmount: 0.20,
    cashbackValidDays: 30,
    tagline: "Doces artesanais feitos especialmente para você! 💖",
    manualStatus: "auto", // "auto" | "open" | "closed" — definido pelo Léo no painel
    openDays: [1, 2, 3, 4, 5, 6],
    openTime: "13:30",
    closeTime: "18:00",
    pixKey: ""
};

let MENU = []; // preenchido em tempo real a partir da coleção "products"
let PROMOTIONS = []; // preenchido a partir da coleção "promotions"
let CATEGORIES = []; // preenchido a partir da coleção "categories" — define a ordem do cardápio
let COUPONS = []; // preenchido a partir da coleção "coupons"

/* ================= STATE (carrinho em memória — sem localStorage) ================= */
let cart = {}; // { itemId: qty }
let fulfillment = "retirada";
let appliedCashback = { amount: 0, orderIds: [] }; // cashback disponível pro telefone digitado no checkout
let cashbackCheckToken = 0; // evita que uma consulta antiga sobrescreva uma mais nova
let appliedCoupon = null; // { id, code, type, value, minOrder } — cupom digitado pelo cliente na sacola

function fmtBRL(v) {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function findItem(id) {
    for (const cat of MENU) {
        const found = cat.items.find(i => i.id === id);
        if (found) return found;
    }
    return null;
}

function normalizePhone(phone) {
    return (phone || '').replace(/\D/g, '');
}

function slugify(str) {
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

/* ================= STATUS ABERTO / FECHADO ================= */
function isOpenNow() {
    if (STORE_INFO.manualStatus === 'open') return true;
    if (STORE_INFO.manualStatus === 'closed') return false;

    const now = new Date();
    const day = now.getDay();
    if (!STORE_INFO.openDays.includes(day)) return false;
    const [oh, om] = STORE_INFO.openTime.split(':').map(Number);
    const [ch, cm] = STORE_INFO.closeTime.split(':').map(Number);
    const minutesNow = now.getHours() * 60 + now.getMinutes();
    return minutesNow >= (oh * 60 + om) && minutesNow <= (ch * 60 + cm);
}

function renderStatus() {
    const open = isOpenNow();
    document.querySelectorAll('.status-pill').forEach(el => {
        el.textContent = open ? 'Aberto agora' : 'Fechado';
        el.classList.toggle('open', open);
        el.classList.toggle('closed', !open);
    });
    renderCart();
}

/* ================= INFO BAR ================= */
function renderStoreInfo() {
    const parts = [STORE_INFO.address, `Retirada ${STORE_INFO.pickupEstimate}`, `Delivery ${STORE_INFO.deliveryEstimate}`].filter(Boolean);
    const infoLineEl = document.getElementById('store-info-line');
    infoLineEl.innerHTML = '';
    parts.forEach(part => {
        const chip = document.createElement('span');
        chip.className = 'info-chip';
        chip.textContent = part; // textContent evita injeção de HTML
        infoLineEl.appendChild(chip);
    });
    document.getElementById('store-tagline').textContent = STORE_INFO.tagline;

    const minOrderDetail = document.getElementById('min-order-detail');
    if (minOrderDetail) {
        minOrderDetail.textContent = STORE_INFO.minOrder
            ? `Pedido mínimo ${fmtBRL(STORE_INFO.minOrder)}`
            : 'Sem pedido mínimo';
    }
    const cashbackDetail = document.getElementById('cashback-detail');
    if (cashbackDetail) {
        cashbackDetail.textContent = STORE_INFO.cashbackAmount
            ? `Cashback de ${fmtBRL(STORE_INFO.cashbackAmount)} por pedido`
            : 'Cashback sujeito a disponibilidade';
    }

    renderPromoBanner();
}

/* ================= PROMOÇÕES ================= */
function getActivePromotions() {
    const today = new Date().toISOString().slice(0, 10);
    return PROMOTIONS.filter(p => {
        if (!p.active) return false;
        if (p.startDate && p.startDate > today) return false;
        if (p.endDate && p.endDate < today) return false;
        return true;
    });
}

function formatCountdown(endDate) {
    if (!endDate) return null;
    const end = new Date(`${endDate}T23:59:59`);
    const diff = end - new Date();
    if (diff <= 0) return null;
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    if (days >= 1) return `Termina em ${days} dia${days > 1 ? 's' : ''}`;
    if (hours >= 1) return `Termina em ${hours}h ${mins}min`;
    return `Termina em ${mins} min`;
}

function renderPromoBanner() {
    const el = document.getElementById('promo-banner');
    if (!el) return;

    // Chips fixos com as regras da loja (frete, pedido mínimo, cashback), vindos do painel.
    const baseChips = [];
    if (STORE_INFO.minOrder) {
        baseChips.push(`<span class="promo-chip">Pedido mínimo ${fmtBRL(STORE_INFO.minOrder)}</span>`);
    }
    if (STORE_INFO.shippingFee) {
        baseChips.push(`<span class="promo-chip">Frete ${fmtBRL(STORE_INFO.shippingFee)} no delivery</span>`);
    }
    if (STORE_INFO.cashbackAmount) {
        const validDays = STORE_INFO.cashbackValidDays || 30;
        baseChips.push(`<span class="promo-chip">Ganhe ${fmtBRL(STORE_INFO.cashbackAmount)} de cashback a cada pedido, válido por ${validDays} dias</span>`);
    }

    // Promoções em destaque cadastradas no painel, com contagem regressiva quando têm data de fim.
    const promoChips = getActivePromotions().map(p => {
        const countdown = formatCountdown(p.endDate);
        return `<span class="promo-chip">🔥 ${p.title}${countdown ? ` <span class="promo-countdown">· ${countdown}</span>` : ''}</span>`;
    });

    const allChips = [...promoChips, ...baseChips];
    if (allChips.length === 0) {
        el.style.display = 'none';
        el.innerHTML = '';
        return;
    }
    el.style.display = 'flex';
    el.innerHTML = allChips.join('');
}

function promoProductRow(item) {
    const lowStock = item.stock != null && item.stock > 0 && item.stock <= 5;
    return `
    <button type="button" class="promo-popup-product" id="promo-prod-${item.id}" onclick="addPromoProduct('${item.id}')">
      <span class="promo-popup-product-photo">${productPhoto(item)}</span>
      <span class="promo-popup-product-info">
        <span class="promo-popup-product-name">${item.name}</span>
        ${priceBlock(item)}
        ${lowStock ? `<span class="item-badge lowstock">Últimas ${item.stock}</span>` : ''}
      </span>
      <span class="promo-popup-product-add" id="promo-prod-add-${item.id}">+</span>
    </button>`;
}

/* ================= CUPONS: exibição no pop-up da tela inicial ================= */
function getActivePromoCoupons() {
    const today = new Date().toISOString().slice(0, 10);
    return COUPONS.filter(c => c.active && c.showInPopup && (!c.expiresAt || c.expiresAt >= today));
}

function couponPopupRow(c) {
    const valueLabel = c.type === 'fixed' ? `${fmtBRL(c.value)} de desconto` : `${c.value}% de desconto`;
    const minOrderLabel = c.minOrder ? `<div class="coupon-popup-min">Em pedidos a partir de ${fmtBRL(c.minOrder)}</div>` : '';
    return `
    <div class="coupon-popup-item">
      <div class="coupon-popup-head">
        <span class="coupon-popup-code">${c.code}</span>
        <span class="coupon-popup-value">${valueLabel}</span>
      </div>
      ${c.description ? `<div class="coupon-popup-desc">${c.description}</div>` : ''}
      ${minOrderLabel}
      <button type="button" class="coupon-popup-use-btn" onclick="useCouponFromPopup('${c.code}')">Usar cupom</button>
    </div>`;
}

function useCouponFromPopup(code) {
    closePromotionPopup();
    openCart();
    const input = document.getElementById('f-cupom');
    if (!input) return;
    input.value = code;
    if (cartCount() > 0) applyCoupon();
}

function renderPromotionPopupContent() {
    const listEl = document.getElementById('promo-popup-list');
    if (!listEl) return;
    const active = getActivePromotions();
    const coupons = getActivePromoCoupons();

    const promosHtml = active.map(p => {
        const items = (p.productIds || []).map(findItem).filter(Boolean);
        const countdown = formatCountdown(p.endDate);
        return `
      <div class="promo-popup-item">
        <div class="promo-popup-item-title">${p.title}</div>
        ${countdown ? `<div class="promo-countdown promo-countdown-popup">⏳ ${countdown}</div>` : ''}
        ${items.length ? `<div class="promo-popup-products">${items.map(promoProductRow).join('')}</div>` : ''}
      </div>`;
    }).join('');

    const couponsHtml = coupons.length
        ? `<div class="promo-popup-item coupon-popup-block">
        <div class="promo-popup-item-title">Cupons disponíveis</div>
        ${coupons.map(couponPopupRow).join('')}
      </div>`
        : '';

    listEl.innerHTML = promosHtml + couponsHtml;
}

function addPromoProduct(id) {
    addItem(id);
    const addIcon = document.getElementById(`promo-prod-add-${id}`);
    const btn = document.getElementById(`promo-prod-${id}`);
    if (!addIcon || !btn) return;
    btn.classList.add('added');
    addIcon.textContent = '✓';
    setTimeout(() => {
        addIcon.textContent = '+';
        btn.classList.remove('added');
    }, 900);
}

function renderPromotionPopup() {
    const active = getActivePromotions();
    const coupons = getActivePromoCoupons();
    const popup = document.getElementById('promo-popup');
    if (!popup || (active.length === 0 && coupons.length === 0)) return;

    const signature = [
        ...active.map(p => p.id || `${p.title}-${p.startDate}-${p.endDate}`),
        ...coupons.map(c => `cupom-${c.id || c.code}`)
    ].join('|');
    const storageKey = 'doces-leo-promo-popup';
    try {
        if (sessionStorage.getItem(storageKey) === signature) return;
        sessionStorage.setItem(storageKey, signature);
    } catch (err) {
        console.warn('Não foi possível salvar o estado do pop-up de promoções.', err);
    }

    renderPromotionPopupContent();
    popup.classList.add('open');
    popup.setAttribute('aria-hidden', 'false');
}

function closePromotionPopup() {
    const popup = document.getElementById('promo-popup');
    if (!popup) return;
    popup.classList.remove('open');
    popup.setAttribute('aria-hidden', 'true');
}

/* ================= CATEGORY CHIPS ================= */
const CATEGORY_ICON_RULES = [
    [/bolo|torta|tortinha/, '🎂'],
    [/brigadeiro|docinho|doce fino|trufa|bombom/, '🍫'],
    [/cookie|biscoito/, '🍪'],
    [/cupcake|muffin/, '🧁'],
    [/pão|pao|salgad/, '🥐'],
    [/sorvete|picolé|picole|gelad/, '🍨'],
    [/bebida|suco|refri/, '🥤'],
    [/pote|copo|taça|taca/, '🍮'],
    [/páscoa|pascoa|ovo/, '🐣'],
    [/natal/, '🎄'],
    [/kit|combo|caixa/, '🎁'],
];

function categoryIcon(name) {
    const n = (name || '').toLowerCase();
    for (const [pattern, icon] of CATEGORY_ICON_RULES) {
        if (pattern.test(n)) return icon;
    }
    return '🍬';
}

function renderChips() {
    const chipsBar = document.getElementById('chips-bar');
    const chipsEl = document.getElementById('category-chips');
    if (!chipsBar || !chipsEl) return;

    chipsBar.hidden = MENU.length === 0;
    chipsEl.innerHTML = MENU.map(cat => {
        const slug = slugify(cat.category);
        return `<a class="chip" href="#cat-${slug}"><span class="chip-icon">${categoryIcon(cat.category)}</span>${cat.category}</a>`;
    }).join('');
}

function scrollChips(direction) {
    const el = document.getElementById('category-chips');
    el.scrollBy({ left: direction * 220, behavior: 'smooth' });
}

/* ================= RENDER MENU ================= */
function normalizeProductImageUrl(url) {
    if (!url) return null;
    if (!url.includes('drive.google.com')) return url;
    const driveFile = url.match(/drive\.google\.com\/file\/d\/([^/?#]+)/);
    let driveId = driveFile?.[1];
    if (!driveId) {
        try {
            driveId = new URL(url).searchParams.get('id');
        } catch (e) {
            driveId = null;
        }
    }
    // Formato "thumbnail" é o mais confiável para exibir publicamente
    // (o antigo "uc?export=view" costuma ser bloqueado para quem
    // acessa o site sem estar logado na mesma conta do Drive).
    return driveId
        ? `https://drive.google.com/thumbnail?id=${driveId}&sz=w1000`
        : url;
}

function productPhoto(item) {
    if (item.img) {
        return `<img src="${normalizeProductImageUrl(item.img)}" alt="${item.name}">`;
    }
    const initials = item.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
    return `<span class="photo-placeholder">${initials}</span>`;
}

function priceBlock(item) {
    const hasPromo = item.promoPrice != null && item.promoPrice < item.price;
    if (hasPromo) {
        return `<div class="item-price"><span class="price-old">${fmtBRL(item.price)}</span> <span class="price-promo">${fmtBRL(item.promoPrice)}</span></div>`;
    }
    return `<div class="item-price">${fmtBRL(item.price)}</div>`;
}

function renderMenu() {
    const root = document.getElementById('menu-root');
    if (MENU.length === 0) {
        root.innerHTML = `<p style="text-align:center;color:var(--brown-700);padding:40px 0;">Cardápio em atualização, volte em instantes.</p>`;
        return;
    }
    root.innerHTML = MENU.map(cat => {
        const slug = slugify(cat.category);
        return `
    <div class="category" id="cat-${slug}">
      <div class="category-title"><span class="chip-icon">${categoryIcon(cat.category)}</span>${cat.category}</div>
      ${cat.items.map(item => {
        const soldOut = item.stock != null && item.stock <= 0;
        const lowStock = !soldOut && item.stock != null && item.stock <= 5;
        const hasPromo = item.promoPrice != null && item.promoPrice < item.price;
        return `
        <div class="item-row ${soldOut ? 'sold-out' : ''}" id="row-${item.id}">
          <div class="item-info">
            <div class="item-name-line">
              <span class="item-name">${item.name}</span>
              ${item.badge ? `<span class="item-badge">${item.badge}</span>` : ''}
              ${hasPromo ? `<span class="item-badge promo">Promoção</span>` : ''}
              ${lowStock ? `<span class="item-badge lowstock">Últimas ${item.stock} unidades</span>` : ''}
              ${soldOut ? `<span class="item-badge soldout">Esgotado</span>` : ''}
            </div>
            ${item.desc ? `<div class="item-desc">${item.desc}</div>` : ''}
            ${priceBlock(item)}
          </div>
          <div class="item-photo">${productPhoto(item)}</div>
          <div class="item-control" id="control-${item.id}">
            ${soldOut ? '' : `<button class="item-add" onclick="addItem('${item.id}')" aria-label="Adicionar ${item.name}">+</button>`}
          </div>
        </div>
      `;
    }).join('')}
    </div>
  `;
    }).join('');

    Object.keys(cart).forEach(renderControl);
}

function renderControl(id) {
    const qty = cart[id] || 0;
    const el = document.getElementById('control-' + id);
    if (!el) return;
    const item = findItem(id);
    if (!item) return;
    const soldOut = item.stock != null && item.stock <= 0;
    if (soldOut) {
        el.innerHTML = '';
        return;
    }
    if (qty <= 0) {
        el.innerHTML = `<button class="item-add" onclick="addItem('${id}')" aria-label="Adicionar ${item.name}">+</button>`;
    } else {
        el.innerHTML = `
      <div class="item-stepper">
        <button onclick="decItem('${id}')" aria-label="Remover uma unidade">–</button>
        <span>${qty}</span>
        <button onclick="addItem('${id}')" aria-label="Adicionar uma unidade">+</button>
      </div>`;
    }
}

function unitPrice(item) {
    return (item.promoPrice != null && item.promoPrice < item.price) ? item.promoPrice : item.price;
}

function addItem(id) {
    const item = findItem(id);
    if (!item) return;
    const currentQty = cart[id] || 0;
    if (item.stock != null && currentQty + 1 > item.stock) {
        alert(`Só temos ${item.stock} unidade(s) de "${item.name}" no momento.`);
        return;
    }
    cart[id] = currentQty + 1;
    renderControl(id);
    renderCart();
}
function decItem(id) {
    if (!cart[id]) return;
    cart[id] -= 1;
    if (cart[id] <= 0) delete cart[id];
    renderControl(id);
    renderCart();
}
function removeItem(id) {
    delete cart[id];
    renderControl(id);
    renderCart();
}

/* ================= CART / DRAWER ================= */
function cartTotal() {
    return Object.entries(cart).reduce((sum, [id, qty]) => {
        const item = findItem(id);
        return sum + (item ? unitPrice(item) * qty : 0);
    }, 0);
}
function cartCount() {
    return Object.values(cart).reduce((a, b) => a + b, 0);
}

function shippingFeeFor(fulfillmentType) {
    return fulfillmentType === 'delivery' ? (STORE_INFO.shippingFee || 0) : 0;
}

/* ================= CUPOM: aplicado manualmente pelo cliente na sacola ================= */
function normalizeCouponCode(code) {
    return (code || '').trim().toUpperCase();
}

function findCouponByCode(code) {
    const normalized = normalizeCouponCode(code);
    return COUPONS.find(c => normalizeCouponCode(c.code) === normalized);
}

function isCouponValid(c) {
    if (!c || !c.active) return false;
    if (c.expiresAt) {
        const today = new Date().toISOString().slice(0, 10);
        if (c.expiresAt < today) return false;
    }
    return true;
}

function couponDiscountAmount(c, subtotal) {
    if (!c) return 0;
    const raw = c.type === 'fixed' ? c.value : subtotal * (c.value / 100);
    return Math.min(subtotal, Math.max(0, raw));
}

// Recalcula o desconto do cupom aplicado com base no subtotal atual
// (o pedido mínimo do cupom pode deixar de valer se o cliente remover itens).
function currentCouponDiscount(subtotal) {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.minOrder && subtotal < appliedCoupon.minOrder) return 0;
    return couponDiscountAmount(appliedCoupon, subtotal);
}

function setCouponMessage(text, isError) {
    const msgEl = document.getElementById('coupon-message');
    if (!msgEl) return;
    msgEl.textContent = text;
    msgEl.classList.toggle('coupon-error', !!isError);
}

// Cashback e cupom não se acumulam: se o cliente aplicar um cupom, o cashback
// automático fica pausado neste pedido até o cupom ser removido.
function updateCashbackHint() {
    const hintEl = document.getElementById('cashback-hint');
    if (!hintEl) return;
    if (appliedCoupon) {
        hintEl.textContent = appliedCashback.amount > 0
            ? `Você tem ${fmtBRL(appliedCashback.amount)} de cashback disponível, mas ele não será usado enquanto o cupom ${appliedCoupon.code} estiver aplicado.`
            : 'Cupom aplicado — o cashback automático fica pausado enquanto o cupom estiver ativo.';
    } else if (appliedCashback.amount > 0) {
        hintEl.textContent = `Cashback de ${fmtBRL(appliedCashback.amount)} será aplicado automaticamente neste pedido.`;
    } else {
        hintEl.textContent = 'Se você tiver cashback disponível, ele é aplicado automaticamente.';
    }
}

function applyCoupon() {
    const input = document.getElementById('f-cupom');
    if (!input) return;
    const code = input.value.trim();
    if (!code) {
        setCouponMessage('Digite um código de cupom.', true);
        return;
    }

    const coupon = findCouponByCode(code);
    if (!coupon || !isCouponValid(coupon)) {
        setCouponMessage('Cupom inválido ou expirado.', true);
        appliedCoupon = null;
        renderCart();
        return;
    }

    const subtotal = cartTotal();
    if (coupon.minOrder && subtotal < coupon.minOrder) {
        setCouponMessage(`Esse cupom exige pedido mínimo de ${fmtBRL(coupon.minOrder)}.`, true);
        appliedCoupon = null;
        renderCart();
        return;
    }

    appliedCoupon = {
        id: coupon.id,
        code: normalizeCouponCode(coupon.code),
        type: coupon.type,
        value: coupon.value,
        minOrder: coupon.minOrder || null
    };
    setCouponMessage(`Cupom ${appliedCoupon.code} aplicado! 🎉`, false);
    input.value = appliedCoupon.code;
    input.disabled = true;
    const btn = document.getElementById('coupon-apply-btn');
    if (btn) {
        btn.textContent = 'Remover';
        btn.setAttribute('onclick', 'removeCoupon()');
    }
    renderCart();
}

function removeCoupon() {
    appliedCoupon = null;
    const input = document.getElementById('f-cupom');
    if (input) {
        input.disabled = false;
        input.value = '';
    }
    setCouponMessage('', false);
    const btn = document.getElementById('coupon-apply-btn');
    if (btn) {
        btn.textContent = 'Aplicar';
        btn.setAttribute('onclick', 'applyCoupon()');
    }
    renderCart();
}

function renderCart() {
    const count = cartCount();
    const subtotal = cartTotal();
    // Cashback e cupom não se acumulam: com cupom aplicado, o cashback fica de fora deste pedido.
    const cashbackDiscount = appliedCoupon ? 0 : Math.min(appliedCashback.amount, subtotal);
    const couponDiscount = currentCouponDiscount(subtotal);
    const shipping = shippingFeeFor(fulfillment);
    const total = Math.max(0, subtotal - cashbackDiscount - couponDiscount + shipping);
    updateCashbackHint();

    document.getElementById('nav-cart-count').textContent = count;
    document.getElementById('fab-cart-count').textContent = count;
    document.getElementById('fab-cart-total').textContent = fmtBRL(total);
    document.getElementById('drawer-total').textContent = fmtBRL(total);
    document.getElementById('cart-fab').classList.toggle('hidden', count === 0);

    const shippingRow = document.getElementById('shipping-fee-row');
    if (shippingRow) {
        if (shipping > 0) {
            shippingRow.classList.remove('hidden');
            document.getElementById('shipping-fee-value').textContent = fmtBRL(shipping);
        } else {
            shippingRow.classList.add('hidden');
        }
    }

    const cashbackRow = document.getElementById('cashback-applied-row');
    if (cashbackRow) {
        if (cashbackDiscount > 0) {
            cashbackRow.classList.remove('hidden');
            document.getElementById('cashback-applied-value').textContent = `− ${fmtBRL(cashbackDiscount)}`;
        } else {
            cashbackRow.classList.add('hidden');
        }
    }

    const couponRow = document.getElementById('coupon-applied-row');
    if (couponRow) {
        if (appliedCoupon && couponDiscount > 0) {
            couponRow.classList.remove('hidden');
            document.getElementById('coupon-applied-code').textContent = appliedCoupon.code;
            document.getElementById('coupon-applied-value').textContent = `− ${fmtBRL(couponDiscount)}`;
        } else {
            couponRow.classList.add('hidden');
        }
    }
    if (appliedCoupon && appliedCoupon.minOrder && subtotal < appliedCoupon.minOrder) {
        setCouponMessage(`Esse cupom exige pedido mínimo de ${fmtBRL(appliedCoupon.minOrder)} — faltam ${fmtBRL(appliedCoupon.minOrder - subtotal)}.`, true);
    }

    const linesEl = document.getElementById('cart-lines');
    const emptyEl = document.getElementById('empty-msg');
    const formEl = document.getElementById('checkout-form');
    const waBtn = document.getElementById('whatsapp-btn');
    const minNote = document.getElementById('min-order-note');

    if (count === 0) {
        linesEl.innerHTML = '';
        emptyEl.style.display = 'block';
        formEl.classList.add('hidden');
        waBtn.disabled = true;
        if (minNote) minNote.style.display = 'none';
        const progressElEmpty = document.getElementById('min-order-progress');
        if (progressElEmpty) progressElEmpty.classList.add('hidden');
        const couponRowEmpty = document.getElementById('coupon-applied-row');
        if (couponRowEmpty) couponRowEmpty.classList.add('hidden');
        return;
    }

    emptyEl.style.display = 'none';
    formEl.classList.remove('hidden');

    const belowMin = STORE_INFO.minOrder && subtotal < STORE_INFO.minOrder;
    const closed = !isOpenNow();
    waBtn.disabled = belowMin || closed;
    if (minNote) {
        if (closed) {
            minNote.style.display = 'block';
            minNote.textContent = 'A loja está fechada no momento — volte durante o horário de atendimento.';
        } else if (belowMin) {
            minNote.style.display = 'block';
            minNote.textContent = `Pedido mínimo de ${fmtBRL(STORE_INFO.minOrder)} — faltam ${fmtBRL(STORE_INFO.minOrder - subtotal)}.`;
        } else {
            minNote.style.display = 'none';
        }
    }

    const progressEl = document.getElementById('min-order-progress');
    const progressFill = document.getElementById('min-order-progress-fill');
    if (progressEl && progressFill) {
        if (belowMin) {
            const pct = Math.min(100, Math.round((subtotal / STORE_INFO.minOrder) * 100));
            progressEl.classList.remove('hidden');
            progressFill.style.width = `${pct}%`;
        } else {
            progressEl.classList.add('hidden');
        }
    }

    linesEl.innerHTML = Object.entries(cart).map(([id, qty]) => {
        const item = findItem(id);
        if (!item) return '';
        return `
      <div class="cart-line">
        <div class="cart-line-photo">${productPhoto(item)}</div>
        <div class="cart-line-info">
          <div class="name">${item.name}</div>
          <div class="unit">${qty} × ${fmtBRL(unitPrice(item))}</div>
          <div class="cart-line-remove" onclick="removeItem('${id}')">remover</div>
        </div>
        <div class="item-stepper">
          <button onclick="decItem('${id}')" aria-label="Remover uma unidade">–</button>
          <span>${qty}</span>
          <button onclick="addItem('${id}')" aria-label="Adicionar uma unidade">+</button>
        </div>
      </div>`;
    }).join('');
}

function openCart() {
    document.getElementById('overlay').classList.add('open');
    document.getElementById('drawer').classList.add('open');
}
function closeCart() {
    document.getElementById('overlay').classList.remove('open');
    document.getElementById('drawer').classList.remove('open');
}

function setFulfillment(type) {
    fulfillment = type;
    document.getElementById('btn-retirada').classList.toggle('active', type === 'retirada');
    document.getElementById('btn-delivery').classList.toggle('active', type === 'delivery');
    const isDelivery = type === 'delivery';
    document.getElementById('bairro-field').style.display = isDelivery ? 'block' : 'none';
    document.getElementById('address-field').style.display = isDelivery ? 'block' : 'none';
    renderCart();
}

/* ================= PIX ================= */
function updatePixInfo() {
    const paymentMethod = document.getElementById('f-pagamento').value;
    const pixInfo = document.getElementById('pix-info');
    if (!pixInfo) return;
    if (paymentMethod === 'pix') {
        document.getElementById('pix-key-value').textContent = STORE_INFO.pixKey || 'Chave Pix não configurada — fale com a gente pelo WhatsApp.';
        pixInfo.classList.remove('hidden');
    } else {
        pixInfo.classList.add('hidden');
    }
}

function copyPixKey() {
    const key = STORE_INFO.pixKey || '';
    if (!key) return;
    const btn = document.getElementById('pix-copy-btn');
    const showCopied = () => {
        const original = btn.textContent;
        btn.textContent = 'Copiado!';
        btn.classList.add('copied');
        setTimeout(() => {
            btn.textContent = original === 'Copiado!' ? 'Copiar' : original;
            btn.classList.remove('copied');
        }, 1500);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(key).then(showCopied).catch(() => fallbackCopy(key, showCopied));
    } else {
        fallbackCopy(key, showCopied);
    }
}

function fallbackCopy(text, onDone) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
        document.execCommand('copy');
        onDone();
    } catch (err) {
        console.error('Não foi possível copiar a chave Pix:', err);
    }
    document.body.removeChild(textarea);
}

document.getElementById('f-pagamento').addEventListener('change', updatePixInfo);

/* ================= CASHBACK: verifica saldo disponível pro telefone digitado ================= */
async function refreshCashbackForPhone() {
    const telefone = document.getElementById('f-telefone').value.trim();
    const phoneDigits = normalizePhone(telefone);
    const myToken = ++cashbackCheckToken;

    if (!phoneDigits || phoneDigits.length < 10) {
        appliedCashback = { amount: 0, orderIds: [] };
        document.getElementById('f-telefone').dataset.checkedPhone = '';
        renderCart();
        return;
    }

    try {
        const snap = await db.collection('orders')
            .where('customerPhoneNormalized', '==', phoneDigits)
            .get();

        if (myToken !== cashbackCheckToken) return; // uma consulta mais nova já foi disparada, descarta esta
        document.getElementById('f-telefone').dataset.checkedPhone = phoneDigits;

        const now = new Date();
        const eligible = [];
        snap.forEach(doc => {
            const d = doc.data();
            if (!d.cashbackAmount || !d.cashbackReleased || d.cashbackRedeemed) return;
            const expiresAt = d.cashbackExpiresAt && d.cashbackExpiresAt.toDate ? d.cashbackExpiresAt.toDate() : null;
            if (expiresAt && expiresAt > now) {
                eligible.push({ id: doc.id, amount: d.cashbackAmount, expiresAt });
            }
        });
        eligible.sort((a, b) => a.expiresAt - b.expiresAt); // consome o cashback mais próximo de vencer primeiro

        appliedCashback = {
            amount: eligible.reduce((s, e) => s + e.amount, 0),
            orderIds: eligible.map(e => e.id)
        };
    } catch (err) {
        console.error('Erro ao verificar cashback:', err);
        appliedCashback = { amount: 0, orderIds: [] };
    }
    renderCart();
}

/* ================= CHECKOUT -> SALVA NO FIRESTORE -> WHATSAPP ================= */
let sendingOrder = false;

async function sendToWhatsapp() {
    if (sendingOrder) return;
    const nome = document.getElementById('f-nome').value.trim();
    const telefone = document.getElementById('f-telefone').value.trim();
    const paymentMethod = document.getElementById('f-pagamento').value;
    const enderecoDetalhes = document.getElementById('f-endereco').value.trim();
    const bairro = document.getElementById('f-bairro').value;

    if (!nome || !telefone) {
        alert('Por favor, preencha nome e telefone antes de enviar o pedido.');
        return;
    }
    if (!paymentMethod) {
        alert('Por favor, selecione a forma de pagamento.');
        return;
    }
    if (fulfillment === 'delivery' && (!bairro || !enderecoDetalhes)) {
        alert('Por favor, selecione o bairro e informe rua e número para a entrega.');
        return;
    }
    const endereco = fulfillment === 'delivery'
        ? `${enderecoDetalhes} — ${bairro}, Dois Vizinhos - PR`
        : '';

    const items = Object.entries(cart).map(([id, qty]) => {
        const item = findItem(id);
        return { productId: id, name: item.name, price: unitPrice(item), qty };
    });
    const phoneDigits = normalizePhone(telefone);
    const subtotal = cartTotal();

    // Garante que o cashback aplicado é realmente do telefone que está no formulário agora
    if (phoneDigits !== normalizePhone(document.getElementById('f-telefone').dataset.checkedPhone || '')) {
        await refreshCashbackForPhone();
    }
    const cashbackUsed = appliedCoupon ? 0 : Math.min(appliedCashback.amount, subtotal);
    const couponUsed = currentCouponDiscount(subtotal);
    const shipping = shippingFeeFor(fulfillment);
    const total = Math.max(0, subtotal - cashbackUsed - couponUsed + shipping);

    const waBtn = document.getElementById('whatsapp-btn');
    sendingOrder = true;
    waBtn.disabled = true;
    waBtn.textContent = 'Enviando pedido...';

    const cashbackAmount = STORE_INFO.cashbackAmount || 0;
    const cashbackValidDays = STORE_INFO.cashbackValidDays || 30;

    try {
        const batch = db.batch();
        const newOrderRef = db.collection('orders').doc();
        batch.set(newOrderRef, {
            items,
            subtotal,
            cashbackUsed,
            couponCode: appliedCoupon ? appliedCoupon.code : null,
            couponDiscount: couponUsed,
            shippingFee: shipping,
            total,
            fulfillment,
            paymentMethod,
            customerName: nome,
            customerPhone: telefone,
            customerPhoneNormalized: phoneDigits,
            address: fulfillment === 'delivery' ? endereco : null,
            status: 'novo',
            paymentStatus: 'pendente',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            cashbackAmount,
            cashbackValidDays,
            cashbackReleased: false,
            cashbackRedeemed: false
        });

        // marca como resgatado o cashback de pedidos anteriores que acabou de ser usado
        if (cashbackUsed > 0) {
            appliedCashback.orderIds.forEach(id => {
                batch.update(db.collection('orders').doc(id), { cashbackRedeemed: true });
            });
        }

        await batch.commit();
    } catch (err) {
        console.error('Erro ao salvar pedido no painel:', err);
        // segue mesmo assim — o pedido ainda pode ser confirmado pelo WhatsApp
    }

    let msg = `Olá, Doces do Léo! Gostaria de fazer o seguinte pedido:\n\n`;
    items.forEach(i => {
        msg += `• ${i.qty}x ${i.name} — ${fmtBRL(i.price * i.qty)}\n`;
    });
    msg += `\nSubtotal: ${fmtBRL(subtotal)}\n`;
    if (shipping > 0) {
        msg += `Frete: ${fmtBRL(shipping)}\n`;
    }
    if (cashbackUsed > 0) {
        msg += `Cashback aplicado: −${fmtBRL(cashbackUsed)}\n`;
    }
    if (couponUsed > 0) {
        msg += `Cupom ${appliedCoupon.code}: −${fmtBRL(couponUsed)}\n`;
    }
    msg += `Total: ${fmtBRL(total)}\n`;
    msg += `\nForma de recebimento: ${fulfillment === 'delivery' ? 'Delivery' : 'Retirada no local'}\n`;
    msg += `Forma de pagamento: ${paymentMethod === 'pix' ? 'Pix' : 'Dinheiro'}\n`;
    if (paymentMethod === 'pix') {
        msg += `📎 Envio o comprovante do Pix aqui em seguida!\n`;
    }
    if (fulfillment === 'delivery') {
        msg += `Endereço: ${endereco}\n`;
    }
    msg += `\nNome: ${nome}\nTelefone: ${telefone}`;

    // Sanitiza o número mesmo que o valor salvo no config esteja mal formatado
    // (com parênteses, espaços ou sem o DDI 55) — evita "página não encontrada" no WhatsApp.
    let waNumber = (STORE_INFO.whatsappNumber || '').replace(/\D/g, '');
    if (waNumber && waNumber.length <= 11) waNumber = '55' + waNumber;

    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');

    appliedCashback = { amount: 0, orderIds: [] };
    removeCoupon();
    sendingOrder = false;
    waBtn.textContent = 'Finalizar pedido no WhatsApp';
    waBtn.disabled = false;
}

/* ================= ÁREA DO CLIENTE ================= */
let clienteLookupInProgress = false;
let clientRegistrationInProgress = false;

function openClienteArea() {
    document.getElementById('cliente-overlay').classList.add('open');
    document.getElementById('cliente-drawer').classList.add('open');
}

function closeClienteArea() {
    document.getElementById('cliente-overlay').classList.remove('open');
    document.getElementById('cliente-drawer').classList.remove('open');
}

function resetClienteArea() {
    document.getElementById('cliente-form').classList.remove('hidden');
    document.getElementById('cliente-results').classList.add('hidden');
    document.getElementById('cliente-results').innerHTML = '';
    document.getElementById('cliente-error').style.display = 'none';
    const noteEl = document.getElementById('cliente-note');
    if (noteEl) noteEl.style.display = 'none';
}

async function registerCliente() {
    if (clientRegistrationInProgress) return;

    const nome = document.getElementById('c-nome').value.trim();
    const telefone = document.getElementById('c-telefone').value.trim();
    const phoneDigits = normalizePhone(telefone);
    const errEl = document.getElementById('cliente-error');
    const noteEl = document.getElementById('cliente-note');
    errEl.style.display = 'none';
    if (noteEl) noteEl.style.display = 'none';

    if (!nome || !telefone) {
        errEl.textContent = 'Preencha nome e telefone para se cadastrar.';
        errEl.style.display = 'block';
        return;
    }
    if (phoneDigits.length < 10) {
        errEl.textContent = 'Informe um telefone válido, com DDD.';
        errEl.style.display = 'block';
        return;
    }

    const btn = document.getElementById('cliente-cadastrar-btn');
    clientRegistrationInProgress = true;
    btn.disabled = true;
    btn.textContent = 'Cadastrando...';
    try {
        await db.collection('customers').doc(phoneDigits).set({
            name: nome,
            phone: telefone,
            phoneNormalized: phoneDigits,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        noteEl.textContent = 'Cadastro realizado! Agora você já faz parte da Doces do Léo. 💛';
        noteEl.style.display = 'block';
    } catch (err) {
        console.error('Erro ao cadastrar cliente:', err);
        errEl.textContent = 'Não foi possível concluir o cadastro agora. Tente novamente em instantes.';
        errEl.style.display = 'block';
    }
    clientRegistrationInProgress = false;
    btn.disabled = false;
    btn.textContent = 'Cadastrar meu contato';
}

async function lookupCliente() {
    if (clienteLookupInProgress) return;

    const nome = document.getElementById('c-nome').value.trim();
    const telefone = document.getElementById('c-telefone').value.trim();
    const errEl = document.getElementById('cliente-error');
    errEl.style.display = 'none';

    if (!nome || !telefone) {
        errEl.textContent = 'Preencha nome e telefone para consultar.';
        errEl.style.display = 'block';
        return;
    }

    const phoneDigits = normalizePhone(telefone);
    const btn = document.getElementById('cliente-consultar-btn');
    clienteLookupInProgress = true;
    const originalText = btn.textContent;
    btn.textContent = 'Consultando...';
    btn.disabled = true;

    try {
        const snap = await db.collection('orders')
            .where('customerPhoneNormalized', '==', phoneDigits)
            .get();

        const orders = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        orders.sort((a, b) => {
            const dateA = a.createdAt && a.createdAt.toDate ? a.createdAt.toDate() : new Date(0);
            const dateB = b.createdAt && b.createdAt.toDate ? b.createdAt.toDate() : new Date(0);
            return dateB - dateA;
        });

        renderClienteResults(nome, orders);
    } catch (err) {
        console.error('Erro ao consultar pedidos:', err);
        errEl.textContent = 'Não foi possível consultar agora. Tente novamente em instantes.';
        errEl.style.display = 'block';
    }

    clienteLookupInProgress = false;
    btn.textContent = originalText;
    btn.disabled = false;
}

const CLIENTE_STATUS_LABELS = { novo: 'Recebido', preparo: 'Em preparo', pronto: 'Pronto', saiu_entrega: 'Saiu para entrega', entregue: 'Entregue', cancelado: 'Cancelado' };

function renderClienteResults(nome, orders) {
    document.getElementById('cliente-form').classList.add('hidden');
    const resultsEl = document.getElementById('cliente-results');
    resultsEl.classList.remove('hidden');

    if (orders.length === 0) {
        resultsEl.innerHTML = `
      <p class="no-orders">Não encontramos pedidos com esse telefone ainda.<br>Faça seu primeiro pedido no cardápio!</p>
      <span class="back-link" onclick="resetClienteArea()">‹ Consultar outro telefone</span>
    `;
        return;
    }

    const now = new Date();
    let cashbackTotal = 0;
    let nearestExpiry = null;

    orders.forEach(o => {
        if (o.cashbackAmount && o.cashbackReleased && o.cashbackExpiresAt && !o.cashbackRedeemed) {
            const expiresAt = o.cashbackExpiresAt.toDate ? o.cashbackExpiresAt.toDate() : new Date(o.cashbackExpiresAt);
            if (expiresAt > now) {
                cashbackTotal += o.cashbackAmount;
                if (!nearestExpiry || expiresAt < nearestExpiry) nearestExpiry = expiresAt;
            }
        }
    });

    let cashbackHtml;
    if (cashbackTotal > 0 && nearestExpiry) {
        const daysLeft = Math.max(1, Math.ceil((nearestExpiry - now) / (1000 * 60 * 60 * 24)));
        cashbackHtml = `
      <div class="cashback-card">
        <div class="amount">${fmtBRL(cashbackTotal)}</div>
        <div class="label">de cashback disponível</div>
        <div class="expiry">Expira em ${daysLeft} dia${daysLeft > 1 ? 's' : ''}</div>
      </div>`;
    } else {
        cashbackHtml = `
      <div class="cashback-card">
        <div class="amount">${fmtBRL(0)}</div>
        <div class="label">de cashback disponível no momento</div>
      </div>`;
    }

    const ordersHtml = orders.map(o => {
        const date = o.createdAt && o.createdAt.toDate ? o.createdAt.toDate() : null;
        const dateStr = date ? date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'data pendente';
        const itemsSummary = (o.items || []).map(i => `${i.qty}x ${i.name}`).join(', ');
        const statusLabel = (o.status === 'pronto' && o.fulfillment !== 'delivery')
            ? 'Disponível para retirada'
            : (CLIENTE_STATUS_LABELS[o.status] || o.status || 'Recebido');
        return `
      <div class="cliente-order">
        <div class="date">${dateStr}<span class="status-tag">${statusLabel}</span></div>
        <div class="items">${itemsSummary}</div>
        <div class="total">${fmtBRL(o.total || 0)}</div>
      </div>`;
    }).join('');

    resultsEl.innerHTML = `
    <p class="cliente-greeting">Olá, ${nome}! 👋</p>
    ${cashbackHtml}
    <div>${ordersHtml}</div>
    <span class="back-link" onclick="resetClienteArea()">‹ Consultar outro telefone</span>
  `;
}

/* ================= FIRESTORE: CONFIG DA LOJA (tempo real) ================= */
function listenStoreConfig() {
    db.collection('config').doc('store').onSnapshot(doc => {
        if (doc.exists) {
            const config = doc.data();
            STORE_INFO = { ...STORE_INFO, ...config, minOrder: config.minOrder ?? 10 };
        }
        renderStoreInfo();
        renderStatus();
    }, err => console.error('Erro ao carregar config da loja:', err));
}

/* ================= FIRESTORE: PRODUTOS (tempo real) ================= */
let PRODUCTS_BY_CATEGORY = {};

function categoryOrderFor(name) {
    const idx = CATEGORIES.findIndex(c => c.name === name);
    return idx === -1 ? 999 : idx;
}

function rebuildMenu() {
    MENU = Object.keys(PRODUCTS_BY_CATEGORY)
        .sort((a, b) => categoryOrderFor(a) - categoryOrderFor(b) || a.localeCompare(b, 'pt-BR'))
        .map(cat => ({
            category: cat,
            items: PRODUCTS_BY_CATEGORY[cat].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.name.localeCompare(b.name, 'pt-BR'))
        }));
    renderChips();
    renderMenu();
    renderCart();
    renderPromotionPopupContent();
}

function listenProducts() {
    db.collection('products').where('active', '==', true).onSnapshot(snap => {
        const byCategory = {};
        snap.forEach(doc => {
            const d = doc.data();
            const cat = d.category || 'Outros';
            if (!byCategory[cat]) byCategory[cat] = [];
            byCategory[cat].push({ id: doc.id, ...d });
        });
        PRODUCTS_BY_CATEGORY = byCategory;
        rebuildMenu();
    }, err => console.error('Erro ao carregar produtos:', err));
}

/* ================= FIRESTORE: CATEGORIAS (tempo real) ================= */
function listenCategories() {
    db.collection('categories').orderBy('order').onSnapshot(snap => {
        CATEGORIES = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        rebuildMenu();
    }, err => console.error('Erro ao carregar categorias:', err));
}

/* ================= FIRESTORE: PROMOÇÕES (tempo real) ================= */
function listenPromotions() {
    db.collection('promotions').onSnapshot(snap => {
        PROMOTIONS = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderPromoBanner();
        renderPromotionPopup();
    }, err => console.error('Erro ao carregar promoções:', err));
}

/* ================= FIRESTORE: CUPONS (tempo real) ================= */
function listenCoupons() {
    db.collection('coupons').onSnapshot(snap => {
        COUPONS = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderPromotionPopupContent();
        renderPromotionPopup();
    }, err => console.error('Erro ao carregar cupons:', err));
}

/* ================= INIT ================= */
renderStoreInfo();
renderStatus();
renderChips();
renderMenu();
setFulfillment('retirada');
renderCart();

listenStoreConfig();
listenCategories();
listenProducts();
listenPromotions();
listenCoupons();

document.getElementById('f-telefone').addEventListener('blur', refreshCashbackForPhone);

setInterval(renderStatus, 60000); // reavalia horário automático a cada minuto
setInterval(() => {
    renderPromoBanner();
    if (document.getElementById('promo-popup')?.classList.contains('open')) {
        renderPromotionPopupContent();
    }
}, 60000); // mantém os contadores regressivos das promoções atualizados
