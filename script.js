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
    minOrder: null,
    tagline: "Doces artesanais feitos especialmente para você! 💖",
    manualStatus: "auto", // "auto" | "open" | "closed" — definido pelo Léo no painel
    openDays: [1, 2, 3, 4, 5, 6],
    openTime: "13:30",
    closeTime: "18:00"
};

let MENU = []; // preenchido em tempo real a partir da coleção "products"
let PROMOTIONS = []; // preenchido a partir da coleção "promotions"

/* ================= STATE (carrinho em memória — sem localStorage) ================= */
let cart = {}; // { itemId: qty }
let fulfillment = "retirada";

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
    const parts = [STORE_INFO.address, `Retirada ${STORE_INFO.pickupEstimate}`, `Delivery ${STORE_INFO.deliveryEstimate}`];
    if (STORE_INFO.minOrder) {
        parts.push(`Pedido mínimo ${fmtBRL(STORE_INFO.minOrder)}`);
    }
    document.getElementById('store-info-line').textContent = parts.join(' · ');
    document.getElementById('store-tagline').textContent = STORE_INFO.tagline;
}

/* ================= PROMOÇÕES (faixa abaixo da tagline) ================= */
function renderPromoBanner() {
    let el = document.getElementById('promo-banner');
    const today = new Date().toISOString().slice(0, 10);
    const active = PROMOTIONS.filter(p => {
        if (!p.active) return false;
        if (p.startDate && p.startDate > today) return false;
        if (p.endDate && p.endDate < today) return false;
        return true;
    });

    if (!el) {
        el = document.createElement('div');
        el.id = 'promo-banner';
        el.className = 'promo-banner';
        const tagline = document.getElementById('store-tagline');
        tagline.insertAdjacentElement('afterend', el);
    }

    if (active.length === 0) {
        el.style.display = 'none';
        el.innerHTML = '';
        return;
    }
    el.style.display = 'flex';
    el.innerHTML = active.map(p => `<span class="promo-chip">🔥 ${p.title}</span>`).join('');
}

/* ================= CATEGORY CHIPS ================= */
function renderChips() {
    const chipsEl = document.getElementById('category-chips');
    chipsEl.innerHTML = MENU.map(cat => {
        const slug = slugify(cat.category);
        return `<a class="chip" href="#cat-${slug}">${cat.category}</a>`;
    }).join('');
}

function scrollChips(direction) {
    const el = document.getElementById('category-chips');
    el.scrollBy({ left: direction * 220, behavior: 'smooth' });
}

/* ================= RENDER MENU ================= */
function productPhoto(item) {
    if (item.img) {
        return `<img src="${item.img}" alt="${item.name}">`;
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
      <div class="category-title">${cat.category}</div>
      ${cat.items.map(item => {
        const soldOut = item.stock != null && item.stock <= 0;
        const hasPromo = item.promoPrice != null && item.promoPrice < item.price;
        return `
        <div class="item-row ${soldOut ? 'sold-out' : ''}" id="row-${item.id}">
          <div class="item-info">
            <div class="item-name-line">
              <span class="item-name">${item.name}</span>
              ${item.badge ? `<span class="item-badge">${item.badge}</span>` : ''}
              ${hasPromo ? `<span class="item-badge promo">Promoção</span>` : ''}
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

function renderCart() {
    const count = cartCount();
    const total = cartTotal();

    document.getElementById('nav-cart-count').textContent = count;
    document.getElementById('fab-cart-count').textContent = count;
    document.getElementById('fab-cart-total').textContent = fmtBRL(total);
    document.getElementById('drawer-total').textContent = fmtBRL(total);
    document.getElementById('cart-fab').classList.toggle('hidden', count === 0);

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
        return;
    }

    emptyEl.style.display = 'none';
    formEl.classList.remove('hidden');

    const belowMin = STORE_INFO.minOrder && total < STORE_INFO.minOrder;
    const closed = !isOpenNow();
    waBtn.disabled = belowMin || closed;
    if (minNote) {
        if (closed) {
            minNote.style.display = 'block';
            minNote.textContent = 'A loja está fechada no momento — volte durante o horário de atendimento.';
        } else if (belowMin) {
            minNote.style.display = 'block';
            minNote.textContent = `Pedido mínimo de ${fmtBRL(STORE_INFO.minOrder)} — faltam ${fmtBRL(STORE_INFO.minOrder - total)}.`;
        } else {
            minNote.style.display = 'none';
        }
    }

    linesEl.innerHTML = Object.entries(cart).map(([id, qty]) => {
        const item = findItem(id);
        if (!item) return '';
        return `
      <div class="cart-line">
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
    document.getElementById('address-field').style.display = (type === 'delivery') ? 'block' : 'none';
}

/* ================= CHECKOUT -> SALVA NO FIRESTORE -> WHATSAPP ================= */
let sendingOrder = false;

async function sendToWhatsapp() {
    if (sendingOrder) return;
    const nome = document.getElementById('f-nome').value.trim();
    const telefone = document.getElementById('f-telefone').value.trim();
    const endereco = document.getElementById('f-endereco').value.trim();

    if (!nome || !telefone) {
        alert('Por favor, preencha nome e telefone antes de enviar o pedido.');
        return;
    }
    if (fulfillment === 'delivery' && !endereco) {
        alert('Por favor, informe o endereço de entrega.');
        return;
    }

    const items = Object.entries(cart).map(([id, qty]) => {
        const item = findItem(id);
        return { productId: id, name: item.name, price: unitPrice(item), qty };
    });
    const total = cartTotal();

    const waBtn = document.getElementById('whatsapp-btn');
    sendingOrder = true;
    waBtn.disabled = true;
    waBtn.textContent = 'Enviando pedido...';

    try {
        await db.collection('orders').add({
            items,
            total,
            fulfillment,
            customerName: nome,
            customerPhone: telefone,
            address: fulfillment === 'delivery' ? endereco : null,
            status: 'novo',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (err) {
        console.error('Erro ao salvar pedido no painel:', err);
        // segue mesmo assim — o pedido ainda pode ser confirmado pelo WhatsApp
    }

    let msg = `Olá, Doces do Léo! Gostaria de fazer o seguinte pedido:\n\n`;
    items.forEach(i => {
        msg += `• ${i.qty}x ${i.name} — ${fmtBRL(i.price * i.qty)}\n`;
    });
    msg += `\nTotal: ${fmtBRL(total)}\n`;
    msg += `\nForma de recebimento: ${fulfillment === 'delivery' ? 'Delivery' : 'Retirada no local'}\n`;
    if (fulfillment === 'delivery') {
        msg += `Endereço: ${endereco}\n`;
    }
    msg += `\nNome: ${nome}\nTelefone: ${telefone}`;

    const url = `https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');

    sendingOrder = false;
    waBtn.textContent = 'Finalizar pedido no WhatsApp';
    waBtn.disabled = false;
}

/* ================= FIRESTORE: CONFIG DA LOJA (tempo real) ================= */
function listenStoreConfig() {
    db.collection('config').doc('store').onSnapshot(doc => {
        if (doc.exists) {
            STORE_INFO = { ...STORE_INFO, ...doc.data() };
        }
        renderStoreInfo();
        renderStatus();
    }, err => console.error('Erro ao carregar config da loja:', err));
}

/* ================= FIRESTORE: PRODUTOS (tempo real) ================= */
function listenProducts() {
    db.collection('products').where('active', '==', true).onSnapshot(snap => {
        const byCategory = {};
        const orderByCategory = {};

        snap.forEach(doc => {
            const d = doc.data();
            const cat = d.category || 'Outros';
            if (!byCategory[cat]) {
                byCategory[cat] = [];
                orderByCategory[cat] = d.categoryOrder ?? 999;
            }
            byCategory[cat].push({ id: doc.id, ...d });
        });

        MENU = Object.keys(byCategory)
            .sort((a, b) => (orderByCategory[a] - orderByCategory[b]) || a.localeCompare(b, 'pt-BR'))
            .map(cat => ({
                category: cat,
                items: byCategory[cat].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || a.name.localeCompare(b.name, 'pt-BR'))
            }));

        renderChips();
        renderMenu();
        renderCart();
    }, err => console.error('Erro ao carregar produtos:', err));
}

/* ================= FIRESTORE: PROMOÇÕES (tempo real) ================= */
function listenPromotions() {
    db.collection('promotions').onSnapshot(snap => {
        PROMOTIONS = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderPromoBanner();
    }, err => console.error('Erro ao carregar promoções:', err));
}

/* ================= INIT ================= */
renderStoreInfo();
renderStatus();
renderChips();
renderMenu();
setFulfillment('retirada');
renderCart();

listenStoreConfig();
listenProducts();
listenPromotions();

setInterval(renderStatus, 60000); // reavalia horário automático a cada minuto
