/* =====================================================================
   Doces do Léo — Painel Administrativo
   ===================================================================== */

/* ================= CARDÁPIO INICIAL (usado só pelo botão "Importar") ================= */
const SEED_MENU = [
    { category: "Bolos gelado", items: [
        { id: "gelado-maracuja-brigadeiro", name: "Bolo gelado maracujá com brigadeiro", desc: "Massa de chocolate, recheio de brigadeiro de maracujá e brigadeiro de chocolate. Peso aproximado de 150g.", price: 12.0 },
        { id: "gelado-chocomousse", name: "Bolo gelado chocomousse", desc: "Massa de chocolate, recheio de mousse de chocolate e brigadeiro de chocolate. Peso aproximado de 150g.", price: 12.0 },
        { id: "gelado-ninho-geleia", name: "Bolo gelado ninho com geleia", desc: "Recheio cremoso de ninho e geleia artesanal de morango, suave na medida certa. Peso aproximado de 130g.", price: 13.0 }
    ]},
    { category: "Brownie", items: [
        { id: "brownie-ninho-nutella", name: "Brownie ninho com nutella", desc: "Macio por dentro, casquinha por fora, recheio de ninho e nutella. 130g.", price: 13.0 },
        { id: "brownie-coberto-chocolate", name: "Brownie coberto com chocolate", desc: "2 pedaços 6x6, recheados com brigadeiro de ninho e nutella, cobertos com chocolate.", price: 16.0 },
        { id: "brownie-morango", name: "Brownie com morango", desc: "Brigadeiro de ninho, nutella e muito morango. Peso aproximado de 200g.", price: 18.0 }
    ]},
    { category: "Bolos de aniversário", items: [
        { id: "aniversario-15-fatias", name: "Bolo 15 fatias", desc: "Sob encomenda — combine o sabor com a gente.", price: 120.0 },
        { id: "aniversario-10-fatias", name: "Bolo 10 fatias", desc: "Sob encomenda — combine o sabor com a gente.", price: 95.0 },
        { id: "aniversario-5-6-fatias", name: "Bolo 5/6 fatias", desc: "Sob encomenda — combine o sabor com a gente.", price: 55.0 },
        { id: "aniversario-mini-presente", name: "Mini para presente", desc: "Tamanho individual, perfeito para presentear.", price: 42.0 }
    ]},
    { category: "Bolo no pote", items: [
        { id: "pote-ninho-nutella", name: "Bolo no pote ninho com nutella", desc: "Bolo de chocolate recheado com brigadeiro de ninho e nutella. Peso aproximado de 250g.", price: 18.0 },
        { id: "pote-maracuja-brigadeiro", name: "Bolo no pote maracujá com brigadeiro", desc: "Massa de chocolate, brigadeiro de maracujá feito com a fruta e brigadeiro cremoso 50% cacau, finalizado com granulado de chocolate nobre.", price: 18.0 },
        { id: "pote-ninho-morango", name: "Bolo no pote ninho com morango", desc: "Massa de baunilha, recheio de brigadeiro de ninho e pedaços de morango. O clássico que todo mundo ama.", price: 17.0 }
    ]},
    { category: "Mini vulcão", items: [
        { id: "vulcao-oreo", name: "Mini vulcão oreo", desc: "Peso aproximado de 250g.", price: 20.0 },
        { id: "vulcao-morango-nutella", name: "Mini vulcão morango + nutella", desc: "Massa de chocolate, recheio de ninho, morangos no meio e por cima para decorar. Peso aproximado de 250g.", price: 22.0 },
        { id: "vulcao-ninho-nutella", name: "Mini vulcão ninho com nutella", desc: "Massa de chocolate, recheio de ninho, nutella e mais nutella para finalizar. Peso aproximado de 250g.", price: 20.0 },
        { id: "vulcao-brigadeiro", name: "Mini vulcão brigadeiro", desc: "Massa de chocolate e recheio de brigadeiro cremoso, para quem ama tudo de chocolate. Peso aproximado de 250g.", price: 20.0 }
    ]},
    { category: "Cone trufado", items: [
        { id: "cone-ouro-branco-nutella", name: "Cone trufado ouro branco com nutella", desc: "Casquinha crocante recheada com trufa de ouro branco e nutella.", price: 23.0 },
        { id: "cone-ninho-nutella", name: "Cone trufado ninho com nutella", desc: "Casquinha crocante recheada com trufa de ninho e nutella.", price: 21.0 },
        { id: "cone-brownie-morango", name: "Cone trufado brownie + morango", desc: "Casquinha crocante coberta com chocolate, brigadeiro cremoso de ninho, brownie, brigadeiro de chocolate e morango.", price: 23.0 }
    ]},
    { category: "Barra recheada", items: [
        { id: "barra-ninho-nutella", name: "Barra de chocolate ninho com nutella", desc: "Cobertura sabor chocolate, recheada com brigadeiro de ninho e nutella. 150g de puro sabor.", price: 15.0 }
    ]},
    { category: "Coxinha", items: [
        { id: "coxinha-frango", name: "Coxinha de frango", desc: "Massa saborosa, recheio de frango cremoso, requeijão e casquinha crocante.", price: 11.0, badge: "Mais pedido" },
        { id: "coxinha-carne", name: "Coxinha de carne", desc: "Massa saborosa, recheio de carne desfiada, cream cheese e casquinha crocante. 150g.", price: 13.0 }
    ]},
    { category: "Bombons", items: [
        { id: "bombom-oreo-nutella", name: "Bombom oreo com nutella", desc: "Brigadeiro de ninho, oreo e nutella, coberto com chocolate e finalizado com granulado. Peso aproximado de 60g.", price: 10.0 },
        { id: "bombom-oreo", name: "Bombom de oreo", desc: "Brigadeiro de ninho e oreo, passado no ninho e finalizado com nutella. Peso aproximado de 60g.", price: 8.0 },
        { id: "bombom-uva", name: "Bombom de uva", desc: "Brigadeiro de ninho, uvas verdes sem semente, coberto com chocolate. Peso aproximado de 70g.", price: 9.0 },
        { id: "bombom-morango", name: "Bombom de morango", desc: "Brigadeiro de ninho, morango e casquinha de chocolate. Peso aproximado de 70g.", price: 12.0, badge: "Mais pedido" },
        { id: "bombom-maracuja-brigadeiro", name: "Bombom de maracujá com brigadeiro", desc: "Brigadeiro de maracujá e brigadeiro de chocolate, com um morango no meio. Peso aproximado de 70g.", price: 12.0 },
        { id: "bombom-morango-cravejado", name: "Bombom de morango cravejado", desc: "", price: 12.0, badge: "Mais pedido" }
    ]},
    { category: "Trufas", items: [
        { id: "trufa-cajuzinho", name: "Trufa cajuzinho", desc: "Brigadeiro de chocolate, amendoim e nutella, coberta com chocolate. Peso de 50g.", price: 6.0 }
    ]},
    { category: "Ouro branco", items: [
        { id: "trufado-ouro-branco", name: "Trufado de ouro branco", desc: "Brigadeiro de ninho, brigadeiro de chocolate, creme de ninho e ouro branco.", price: 23.0 }
    ]},
    { category: "Fatias de bolo", items: [
        { id: "bolo-chocolatudo", name: "Bolo chocolatudo", desc: "Massa de chocolate, recheio de brigadeiro e creme de ninho, finalizado com granulado de chocolate.", price: 19.0 },
        { id: "fatia-chocolate", name: "Fatia de chocolate", desc: "Massa de chocolate e recheio de brigadeiro cremoso. Peso aproximado de 200g.", price: 18.0 },
        { id: "fatia-ninho-morango", name: "Fatia de ninho com morango", desc: "Massa de baunilha e recheio de brigadeiro de ninho cremoso com pedaços de morango.", price: 20.0 }
    ]},
    { category: "Refrigerantes", items: [
        { id: "coca-tradicional", name: "Coca tradicional", desc: "", price: 3.0 },
        { id: "coca-zero", name: "Coca zero", desc: "", price: 3.0 }
    ]},
    { category: "Outros", items: [
        { id: "delicia-dos-sonhos", name: "Delícia dos sonhos", desc: "Camadas de ninho, brigadeiro, brownie e morangos para equilibrar. Peso aproximado de 270g.", price: 20.0 },
        { id: "bombom-aberto-morango", name: "Bombom aberto de morango", desc: "Potinho de 145ml com morangos, ninho e brigadeiro cremoso.", price: 13.0 },
        { id: "coxinha-morango-nutella", name: "Coxinha de morango com nutella", desc: "Brigadeiro de ninho, morango e finalizado com nutella. Peso aproximado de 70g.", price: 12.0 },
        { id: "copo-felicidade-choconinho", name: "Copo da felicidade choconinho", desc: "Brigadeiro de ninho, brigadeiro de chocolate e brownie. Em média 300g.", price: 17.0 },
        { id: "copo-felicidade-maracuja", name: "Copo da felicidade maracujá com brigadeiro", desc: "Brigadeiro de chocolate, brigadeiro de maracujá feito com a fruta e brownie. Aproximadamente 300g.", price: 17.0 },
        { id: "trufa-brownie", name: "Trufa brownie", desc: "Recheada com brigadeiro, ninho e brownie. 50g.", price: 5.0 },
        { id: "guarana", name: "Guaraná", desc: "", price: 3.0 }
    ]}
];

function fmtBRL(v) {
    return (v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/* ================= AUTH ================= */
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const errEl = document.getElementById('login-error');
    errEl.textContent = '';
    try {
        await auth.signInWithEmailAndPassword(email, password);
    } catch (err) {
        errEl.textContent = 'E-mail ou senha inválidos.';
        console.error(err);
    }
});

function logout() {
    auth.signOut();
}

auth.onAuthStateChanged(user => {
    if (user) {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('admin-app').classList.remove('hidden');
        document.getElementById('admin-user-email').textContent = user.email;
        startListeners();
    } else {
        document.getElementById('login-screen').classList.remove('hidden');
        document.getElementById('admin-app').classList.add('hidden');
    }
});

let listenersStarted = false;
function startListeners() {
    if (listenersStarted) return;
    listenersStarted = true;
    listenStoreConfig();
    listenCategories();
    listenProducts();
    listenCustomers();
    listenPromotions();
    listenCoupons();
    listenCashflow();
    listenOrders();
}

/* ================= TABS ================= */
function switchTab(name) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === name));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === 'tab-' + name));
    if (name === 'painel') renderDashboard();
}

/* ================= STATUS DA LOJA ================= */
let currentStoreConfig = {};

function listenStoreConfig() {
    db.collection('config').doc('store').onSnapshot(doc => {
        currentStoreConfig = doc.exists ? doc.data() : {};
        renderStoreStatusUI();
        fillConfigForm();
    });
}

function renderStoreStatusUI() {
    const mode = currentStoreConfig.manualStatus || 'auto';
    document.querySelectorAll('#store-toggle button').forEach(b => b.classList.toggle('active', b.dataset.mode === mode));

    let open;
    if (mode === 'open') open = true;
    else if (mode === 'closed') open = false;
    else open = isOpenNowFromConfig();

    const pill = document.getElementById('admin-status-pill');
    pill.textContent = open ? 'Aberto agora' : 'Fechado';
    pill.classList.toggle('open', open);
    pill.classList.toggle('closed', !open);
}

function isOpenNowFromConfig() {
    const days = currentStoreConfig.openDays || [1, 2, 3, 4, 5, 6];
    const openTime = currentStoreConfig.openTime || '13:30';
    const closeTime = currentStoreConfig.closeTime || '18:00';
    const now = new Date();
    if (!days.includes(now.getDay())) return false;
    const [oh, om] = openTime.split(':').map(Number);
    const [ch, cm] = closeTime.split(':').map(Number);
    const minutesNow = now.getHours() * 60 + now.getMinutes();
    return minutesNow >= (oh * 60 + om) && minutesNow <= (ch * 60 + cm);
}

function setStoreMode(mode) {
    db.collection('config').doc('store').set({ manualStatus: mode }, { merge: true });
}

/* ================= CONFIG DA LOJA (form) ================= */
function fillConfigForm() {
    const c = currentStoreConfig;
    document.getElementById('cfg-tagline').value = c.tagline || '';
    document.getElementById('cfg-address').value = c.address || '';
    document.getElementById('cfg-pickup-map-link').value = c.pickupMapLink || '';
    document.getElementById('cfg-pickup').value = c.pickupEstimate || '';
    document.getElementById('cfg-delivery').value = c.deliveryEstimate || '';
    document.getElementById('cfg-min-order').value = c.minOrder || '';
    document.getElementById('cfg-shipping-fee').value = c.shippingFee || '';
    document.getElementById('cfg-whatsapp').value = c.whatsappNumber || '';
    document.getElementById('cfg-pix-key').value = c.pixKey || '';
    document.getElementById('cfg-open-time').value = c.openTime || '13:30';
    document.getElementById('cfg-close-time').value = c.closeTime || '18:00';
    const days = c.openDays || [1, 2, 3, 4, 5, 6];
    document.querySelectorAll('#weekday-picker input').forEach(cb => {
        cb.checked = days.includes(Number(cb.value));
    });
}

document.getElementById('store-config-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const days = Array.from(document.querySelectorAll('#weekday-picker input:checked')).map(cb => Number(cb.value));
    const minOrderVal = document.getElementById('cfg-min-order').value;
    const shippingFeeVal = document.getElementById('cfg-shipping-fee').value;

    // Garante que o número salvo é só dígitos com DDI 55 — um link wa.me com
    // parênteses, espaços ou sem o 55 abre "página não encontrada" pro cliente.
    let whatsappDigits = document.getElementById('cfg-whatsapp').value.replace(/\D/g, '');
    if (whatsappDigits && whatsappDigits.length <= 11) whatsappDigits = '55' + whatsappDigits;

    const payload = {
        tagline: document.getElementById('cfg-tagline').value.trim(),
        address: document.getElementById('cfg-address').value.trim(),
        pickupMapLink: document.getElementById('cfg-pickup-map-link').value.trim(),
        pickupEstimate: document.getElementById('cfg-pickup').value.trim(),
        deliveryEstimate: document.getElementById('cfg-delivery').value.trim(),
        minOrder: minOrderVal ? Number(minOrderVal) : null,
        shippingFee: shippingFeeVal ? Number(shippingFeeVal) : 0,
        whatsappNumber: whatsappDigits,
        pixKey: document.getElementById('cfg-pix-key').value.trim(),
        openTime: document.getElementById('cfg-open-time').value,
        closeTime: document.getElementById('cfg-close-time').value,
        openDays: days
    };
    await db.collection('config').doc('store').set(payload, { merge: true });
    document.getElementById('cfg-whatsapp').value = whatsappDigits;
    const note = document.getElementById('config-save-note');
    note.textContent = 'Dados salvos!';
    setTimeout(() => note.textContent = '', 2500);
});

/* ================= CATEGORIAS ================= */
let allCategories = [];

function listenCategories() {
    db.collection('categories').orderBy('order').onSnapshot(snap => {
        allCategories = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderCategoriesList();
        populateProductCategorySelect();
        renderProductsList(); // reordena produtos conforme a nova ordem de categorias
    }, err => console.error('Erro ao carregar categorias:', err));
}

function categoryOrderFor(name) {
    const idx = allCategories.findIndex(c => c.name === name);
    return idx === -1 ? 999 : idx;
}

function populateProductCategorySelect(selected) {
    const select = document.getElementById('p-category');
    if (!select) return;
    const current = selected !== undefined ? selected : select.value;
    if (allCategories.length === 0) {
        select.innerHTML = `<option value="">Nenhuma categoria cadastrada — crie uma primeiro</option>`;
        return;
    }
    select.innerHTML = `<option value="">Selecione uma categoria</option>` +
        allCategories.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
    if (current) select.value = current;
}

function renderCategoriesList() {
    const root = document.getElementById('categories-list');
    if (!root) return;
    if (allCategories.length === 0) {
        root.innerHTML = `<p class="hint-text">Nenhuma categoria cadastrada ainda. Crie uma nova ou importe as categorias já usadas nos produtos.</p>`;
        return;
    }
    root.innerHTML = allCategories.map((c, i) => {
        const count = allProducts.filter(p => p.category === c.name).length;
        return `
      <div class="category-row">
        <div class="category-order-btns">
          <button type="button" ${i === 0 ? 'disabled' : ''} onclick="moveCategory('${c.id}', -1)" aria-label="Mover para cima">▲</button>
          <button type="button" ${i === allCategories.length - 1 ? 'disabled' : ''} onclick="moveCategory('${c.id}', 1)" aria-label="Mover para baixo">▼</button>
        </div>
        <div class="cat-name" onclick="openCategoryModal('${c.id}')">${c.name}</div>
        <span class="cat-count">${count} produto${count === 1 ? '' : 's'}</span>
      </div>`;
    }).join('');
}

async function moveCategory(id, direction) {
    const idx = allCategories.findIndex(c => c.id === id);
    const swapIdx = idx + direction;
    if (idx === -1 || swapIdx < 0 || swapIdx >= allCategories.length) return;
    const a = allCategories[idx];
    const b = allCategories[swapIdx];
    const batch = db.batch();
    batch.update(db.collection('categories').doc(a.id), { order: b.order ?? swapIdx });
    batch.update(db.collection('categories').doc(b.id), { order: a.order ?? idx });
    await batch.commit();
}

let categoryModalFromProduct = false;

function openCategoryModal(id, fromProduct) {
    categoryModalFromProduct = !!fromProduct;
    const form = document.getElementById('category-form');
    form.reset();
    document.getElementById('cat-id').value = id || '';
    document.getElementById('cat-delete-btn').style.display = id ? 'block' : 'none';
    document.getElementById('category-modal-title').textContent = id ? 'Editar categoria' : 'Nova categoria';
    if (id) {
        const c = allCategories.find(x => x.id === id);
        if (c) document.getElementById('cat-name').value = c.name || '';
    }
    document.getElementById('category-modal').classList.add('open');
}

function closeCategoryModal() {
    document.getElementById('category-modal').classList.remove('open');
}

document.getElementById('category-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('cat-id').value;
    const name = document.getElementById('cat-name').value.trim();
    if (!name) return;

    const duplicate = allCategories.find(c => c.name.toLowerCase() === name.toLowerCase() && c.id !== id);
    if (duplicate) {
        alert('Já existe uma categoria com esse nome.');
        return;
    }

    if (id) {
        const old = allCategories.find(c => c.id === id);
        await db.collection('categories').doc(id).set({ name }, { merge: true });
        // mantém os produtos já cadastrados apontando pro novo nome da categoria
        if (old && old.name !== name) {
            const affected = allProducts.filter(p => p.category === old.name);
            if (affected.length > 0) {
                const batch = db.batch();
                affected.forEach(p => batch.update(db.collection('products').doc(p.id), { category: name }));
                await batch.commit();
            }
        }
    } else {
        const maxOrder = allCategories.reduce((m, c) => Math.max(m, c.order ?? 0), -1);
        await db.collection('categories').add({ name, order: maxOrder + 1 });
        if (categoryModalFromProduct) {
            // dá tempo do listener atualizar allCategories antes de selecionar a nova categoria
            setTimeout(() => populateProductCategorySelect(name), 400);
        }
    }
    closeCategoryModal();
});

async function deleteCurrentCategory() {
    const id = document.getElementById('cat-id').value;
    if (!id) return;
    const cat = allCategories.find(c => c.id === id);
    const count = cat ? allProducts.filter(p => p.category === cat.name).length : 0;
    if (count > 0) {
        alert(`Existem ${count} produto(s) nesta categoria. Mude a categoria deles antes de excluir.`);
        return;
    }
    if (!confirm('Excluir esta categoria?')) return;
    await db.collection('categories').doc(id).delete();
    closeCategoryModal();
}

async function importCategoriesFromProducts() {
    const existingNames = new Set(allCategories.map(c => c.name));
    const productCats = [...new Set(allProducts.map(p => p.category).filter(Boolean))]
        .filter(name => !existingNames.has(name));
    if (productCats.length === 0) {
        alert('Todas as categorias dos produtos já estão cadastradas.');
        return;
    }
    // preserva a ordem que os produtos já tinham, quando existir
    productCats.sort((a, b) => {
        const orderA = allProducts.find(p => p.category === a)?.categoryOrder ?? 999;
        const orderB = allProducts.find(p => p.category === b)?.categoryOrder ?? 999;
        return orderA - orderB || a.localeCompare(b, 'pt-BR');
    });
    let nextOrder = allCategories.reduce((m, c) => Math.max(m, c.order ?? 0), -1) + 1;
    const batch = db.batch();
    productCats.forEach(name => {
        const ref = db.collection('categories').doc();
        batch.set(ref, { name, order: nextOrder });
        nextOrder++;
    });
    await batch.commit();
    alert(`${productCats.length} categoria(s) importada(s)!`);
}

/* ================= PAINEL / GRÁFICOS ================= */
let revenueChart = null;
let statusChart = null;
let topProductsChart = null;

function isDashboardActive() {
    const panel = document.getElementById('tab-painel');
    return !!panel && panel.classList.contains('active');
}

function buildDashboardStats() {
    const days = [];
    for (let i = 13; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push(d.toISOString().slice(0, 10));
    }
    const revenueByDay = Object.fromEntries(days.map(d => [d, 0]));
    const statusCounts = {};
    const productQty7d = {};

    const todayStr = new Date().toISOString().slice(0, 10);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    let ordersToday = 0, revenueToday = 0, orders7d = 0, revenue7d = 0;

    allOrders.forEach(o => {
        statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
        if (o.status === 'cancelado') return; // cancelado não entra no faturamento

        const date = o.createdAt && o.createdAt.toDate ? o.createdAt.toDate() : null;
        const dayStr = date ? date.toISOString().slice(0, 10) : null;

        if (dayStr && Object.prototype.hasOwnProperty.call(revenueByDay, dayStr)) {
            revenueByDay[dayStr] += (o.total || 0);
        }
        if (dayStr === todayStr) {
            ordersToday++;
            revenueToday += (o.total || 0);
        }
        if (date && date >= sevenDaysAgo) {
            orders7d++;
            revenue7d += (o.total || 0);
            (o.items || []).forEach(i => {
                productQty7d[i.name] = (productQty7d[i.name] || 0) + i.qty;
            });
        }
    });

    const topProducts = Object.entries(productQty7d).sort((a, b) => b[1] - a[1]).slice(0, 5);

    return { days, revenueByDay, statusCounts, topProducts, ordersToday, revenueToday, orders7d, revenue7d };
}

const DASHBOARD_STATUS_LABELS = { novo: 'Novo', preparo: 'Em preparo', pronto: 'Pronto', saiu_entrega: 'Saiu p/ entrega', entregue: 'Entregue', cancelado: 'Cancelado' };
const DASHBOARD_COLORS = ['#B9854F', '#5A3A24', '#7A8B6F', '#CE9C86', '#96693B', '#B23B3B'];

function renderDashboard() {
    // Só monta os gráficos quando a aba está visível, senão o canvas fica com largura 0.
    if (!isDashboardActive() || typeof Chart === 'undefined') return;

    const stats = buildDashboardStats();

    document.getElementById('kpi-orders-today').textContent = stats.ordersToday;
    document.getElementById('kpi-revenue-today').textContent = fmtBRL(stats.revenueToday);
    document.getElementById('kpi-orders-7d').textContent = stats.orders7d;
    document.getElementById('kpi-revenue-7d').textContent = fmtBRL(stats.revenue7d);
    document.getElementById('kpi-ticket-7d').textContent = fmtBRL(stats.orders7d ? stats.revenue7d / stats.orders7d : 0);

    const lowStockProducts = allProducts.filter(p => p.stock != null && p.stock <= 3 && p.active !== false);
    document.getElementById('kpi-lowstock').textContent = lowStockProducts.length;
    renderLowStockList(lowStockProducts);

    const dayLabels = stats.days.map(d => {
        const [, m, day] = d.split('-');
        return `${day}/${m}`;
    });
    const revenueValues = stats.days.map(d => Number(stats.revenueByDay[d].toFixed(2)));

    if (revenueChart) revenueChart.destroy();
    revenueChart = new Chart(document.getElementById('chart-revenue'), {
        type: 'bar',
        data: {
            labels: dayLabels,
            datasets: [{ label: 'Faturamento', data: revenueValues, backgroundColor: '#B9854F', borderRadius: 4 }]
        },
        options: {
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, ticks: { callback: v => fmtBRL(v) } } }
        }
    });

    const statusKeys = Object.keys(stats.statusCounts);
    if (statusChart) statusChart.destroy();
    statusChart = new Chart(document.getElementById('chart-status'), {
        type: 'doughnut',
        data: {
            labels: statusKeys.map(k => DASHBOARD_STATUS_LABELS[k] || k),
            datasets: [{ data: statusKeys.map(k => stats.statusCounts[k]), backgroundColor: DASHBOARD_COLORS }]
        },
        options: {
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } } }
        }
    });

    if (topProductsChart) topProductsChart.destroy();
    topProductsChart = new Chart(document.getElementById('chart-top-products'), {
        type: 'bar',
        data: {
            labels: stats.topProducts.map(([name]) => name),
            datasets: [{ label: 'Unidades vendidas', data: stats.topProducts.map(([, qty]) => qty), backgroundColor: '#7A8B6F', borderRadius: 4 }]
        },
        options: {
            indexAxis: 'y',
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { x: { beginAtZero: true, ticks: { stepSize: 1 } } }
        }
    });
}

function renderLowStockList(list) {
    const root = document.getElementById('lowstock-list');
    if (!root) return;
    if (list.length === 0) {
        root.innerHTML = `<p class="hint-text">Nenhum produto com estoque baixo no momento. 🎉</p>`;
        return;
    }
    root.innerHTML = list.slice().sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0)).map(p => `
    <div class="product-row" onclick="switchTab('produtos'); openProductModal('${p.id}');">
      <div class="p-thumb">${p.img ? `<img src="${normalizeProductImageUrl(p.img)}" alt="">` : '🍰'}</div>
      <div class="p-info">
        <div class="p-name">${p.name}</div>
        <div class="p-cat">${p.category || 'Sem categoria'}</div>
      </div>
      <div class="p-flags">${p.stock <= 0 ? '<span class="flag lowstock">Esgotado</span>' : `<span class="flag lowstock">Restam ${p.stock}</span>`}</div>
    </div>
  `).join('');
}

/* ================= PRODUTOS ================= */
let allProducts = [];
let productStockFilter = 'all';

function listenProducts() {
    db.collection('products').onSnapshot(snap => {
        allProducts = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => categoryOrderFor(a.category) - categoryOrderFor(b.category) || (a.category || '').localeCompare(b.category || '', 'pt-BR') || a.name.localeCompare(b.name, 'pt-BR'));
        renderProductsList();
        renderCategoriesList();
        renderDashboard();
    });
}

document.getElementById('product-search').addEventListener('input', renderProductsList);

document.getElementById('stock-filters').addEventListener('click', (e) => {
    const btn = e.target.closest('.chip-filter');
    if (!btn) return;
    productStockFilter = btn.dataset.stock;
    document.querySelectorAll('#stock-filters .chip-filter').forEach(b => b.classList.toggle('active', b === btn));
    renderProductsList();
});

function renderProductsList() {
    const term = document.getElementById('product-search').value.trim().toLowerCase();
    let list = allProducts.filter(p =>
        !term || p.name.toLowerCase().includes(term) || (p.category || '').toLowerCase().includes(term)
    );
    if (productStockFilter === 'low') {
        list = list.filter(p => p.stock != null && p.stock > 0 && p.stock <= 3);
    } else if (productStockFilter === 'out') {
        list = list.filter(p => p.stock != null && p.stock <= 0);
    }
    const root = document.getElementById('products-list');
    if (list.length === 0) {
        root.innerHTML = `<p class="hint-text">Nenhum produto encontrado.</p>`;
        return;
    }
    root.innerHTML = list.map(p => {
        const flags = [];
        if (p.active === false) flags.push('<span class="flag inactive">Inativo</span>');
        if (p.stock != null && p.stock <= 0) flags.push('<span class="flag lowstock">Esgotado</span>');
        else if (p.stock != null && p.stock <= 3) flags.push(`<span class="flag lowstock">Estoque baixo (${p.stock})</span>`);
        if (p.promoPrice != null && p.promoPrice < p.price) flags.push('<span class="flag promo">Promoção</span>');
        const stockControl = p.stock != null
            ? `<div class="p-stock-control" onclick="event.stopPropagation()">
              <button type="button" onclick="adjustStock('${p.id}', -1)" aria-label="Diminuir estoque">–</button>
              <span>${p.stock}</span>
              <button type="button" onclick="adjustStock('${p.id}', 1)" aria-label="Aumentar estoque">+</button>
            </div>`
            : `<div class="p-stock-control" onclick="event.stopPropagation()"><span class="p-stock-unlimited">sem controle</span></div>`;
        return `
      <div class="product-row" onclick="openProductModal('${p.id}')">
        <div class="p-thumb">${p.img ? `<img src="${normalizeProductImageUrl(p.img)}" alt="">` : '🍰'}</div>
        <div class="p-info">
          <div class="p-name">${p.name}</div>
          <div class="p-cat">${p.category || 'Sem categoria'}</div>
        </div>
        <div class="p-price">${fmtBRL(p.promoPrice != null && p.promoPrice < p.price ? p.promoPrice : p.price)}</div>
        ${stockControl}
        <div class="p-flags">${flags.join('')}</div>
      </div>`;
    }).join('');
}

async function adjustStock(id, delta) {
    const p = allProducts.find(x => x.id === id);
    if (!p || p.stock == null) return;
    const newStock = Math.max(0, p.stock + delta);
    try {
        await db.collection('products').doc(id).update({ stock: newStock });
    } catch (err) {
        console.error('Erro ao atualizar estoque:', err);
        alert('Não foi possível atualizar o estoque agora. Tente de novo em instantes.');
    }
}

function openProductModal(id) {
    const form = document.getElementById('product-form');
    form.reset();
    document.getElementById('p-id').value = id || '';
    document.getElementById('p-delete-btn').style.display = id ? 'block' : 'none';
    document.getElementById('product-modal-title').textContent = id ? 'Editar produto' : 'Novo produto';

    if (id) {
        const p = allProducts.find(x => x.id === id);
        if (p) {
            populateProductCategorySelect(p.category || '');
            document.getElementById('p-name').value = p.name || '';
            document.getElementById('p-desc').value = p.desc || '';
            document.getElementById('p-price').value = p.price ?? '';
            document.getElementById('p-promo-price').value = p.promoPrice ?? '';
            document.getElementById('p-stock').value = p.stock ?? '';
            document.getElementById('p-badge').value = p.badge || '';
            document.getElementById('p-img').value = p.img || '';
            document.getElementById('p-active').checked = p.active !== false;
        }
    } else {
        populateProductCategorySelect('');
        document.getElementById('p-active').checked = true;
    }
    document.getElementById('product-modal').classList.add('open');
}

function closeProductModal() {
    document.getElementById('product-modal').classList.remove('open');
}

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
    // (o antigo "uc?export=view" costuma ser bloqueado para visitantes
    // que não estão logados na mesma conta Google do dono do arquivo).
    return driveId
        ? `https://drive.google.com/thumbnail?id=${driveId}&sz=w1000`
        : url;
}

document.getElementById('product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('p-id').value;
    const category = document.getElementById('p-category').value.trim();
    const stockVal = document.getElementById('p-stock').value;
    const promoVal = document.getElementById('p-promo-price').value;

    if (!category) {
        alert('Selecione uma categoria para o produto (crie uma nova pelo botão "+ Nova" se precisar).');
        return;
    }

    const payload = {
        category,
        name: document.getElementById('p-name').value.trim(),
        desc: document.getElementById('p-desc').value.trim(),
        price: Number(document.getElementById('p-price').value),
        promoPrice: promoVal ? Number(promoVal) : null,
        stock: stockVal ? Number(stockVal) : null,
        badge: document.getElementById('p-badge').value.trim() || null,
        img: normalizeProductImageUrl(document.getElementById('p-img').value.trim()),
        active: document.getElementById('p-active').checked
    };

    if (id) {
        await db.collection('products').doc(id).set(payload, { merge: true });
    } else {
        await db.collection('products').add(payload);
    }
    closeProductModal();
});

async function deleteCurrentProduct() {
    const id = document.getElementById('p-id').value;
    if (!id) return;
    if (!confirm('Excluir este produto permanentemente?')) return;
    await db.collection('products').doc(id).delete();
    closeProductModal();
}

async function seedInitialMenu() {
    const totalItems = SEED_MENU.reduce((total, category) => total + category.items.length, 0);
    if (!auth?.currentUser) {
        alert('Sua sessão expirou. Entre novamente no painel antes de importar o cardápio.');
        return;
    }
    if (!confirm(`Isso vai adicionar ${totalItems} itens do cardápio inicial ao banco de dados (sem apagar produtos já existentes). Continuar?`)) return;
    const btn = document.getElementById('seed-btn');
    btn.disabled = true;
    btn.textContent = 'Importando...';
    try {
        const batch = db.batch();
        const existingCatNames = new Set(allCategories.map(c => c.name));
        let nextCatOrder = allCategories.reduce((m, c) => Math.max(m, c.order ?? 0), -1) + 1;
        SEED_MENU.forEach((cat) => {
            if (!existingCatNames.has(cat.category)) {
                const catRef = db.collection('categories').doc();
                batch.set(catRef, { name: cat.category, order: nextCatOrder });
                existingCatNames.add(cat.category);
                nextCatOrder++;
            }
        });
        SEED_MENU.forEach((cat, catIndex) => {
            cat.items.forEach((item, itemIndex) => {
                const ref = db.collection('products').doc(item.id);
                batch.set(ref, {
                    category: cat.category,
                    categoryOrder: catIndex,
                    sortOrder: itemIndex,
                    name: item.name,
                    desc: item.desc || '',
                    price: item.price,
                    promoPrice: null,
                    stock: null,
                    badge: item.badge || null,
                    img: null,
                    active: true
                }, { merge: true });
            });
        });
        await batch.commit();
        alert(`${totalItems} itens do cardápio foram importados com sucesso!`);
    } catch (err) {
        console.error(err);
        let message = 'Não foi possível importar o cardápio agora.';
        if (err.code === 'permission-denied') {
            message += ' O Firebase recusou a gravação para esta conta. Verifique as regras do Firestore e se o usuário logado tem permissão de escrita.';
        } else if (err.code === 'unauthenticated') {
            message += ' Sua sessão expirou. Entre novamente no painel e tente de novo.';
        } else if (err.code === 'unavailable') {
            message += ' Não foi possível conectar ao Firebase. Confira sua conexão e tente novamente.';
        } else if (err.message) {
            message += ` Detalhe: ${err.message}`;
        }
        alert(message);
    }
    btn.disabled = false;
    btn.textContent = 'Importar cardápio inicial';
}

/* ================= PROMOÇÕES ================= */
let allPromos = [];
let selectedPromoProductIds = new Set();

function listenPromotions() {
    db.collection('promotions').onSnapshot(snap => {
        allPromos = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderPromosList();
    });
}

function renderPromosList() {
    const root = document.getElementById('promos-list');
    if (allPromos.length === 0) {
        root.innerHTML = `<p class="hint-text">Nenhuma promoção cadastrada ainda.</p>`;
        return;
    }
    root.innerHTML = allPromos.map(p => `
    <div class="promo-row" onclick="openPromoModal('${p.id}')">
      <div>
        <div class="pr-title">${p.title}</div>
        <div class="pr-dates">${p.startDate || 'sem início'} até ${p.endDate || 'sem fim'} · ${p.active ? 'Ativa' : 'Inativa'}${p.productIds && p.productIds.length ? ` · ${p.productIds.length} produto(s)` : ''}</div>
      </div>
    </div>
  `).join('');
}

function renderPromoProductPicker() {
    const term = document.getElementById('pr-product-search').value.trim().toLowerCase();
    const root = document.getElementById('pr-products-list');
    const list = allProducts.filter(p =>
        !term || p.name.toLowerCase().includes(term) || (p.category || '').toLowerCase().includes(term)
    );
    if (list.length === 0) {
        root.innerHTML = `<p class="hint-text" style="margin:6px 0 0;">Nenhum produto encontrado.</p>`;
        return;
    }
    root.innerHTML = list.map(p => `
    <label class="promo-product-row">
      <input type="checkbox" value="${p.id}" ${selectedPromoProductIds.has(p.id) ? 'checked' : ''} onchange="togglePromoProduct('${p.id}', this.checked)">
      <div class="p-thumb">${p.img ? `<img src="${normalizeProductImageUrl(p.img)}" alt="">` : '🍰'}</div>
      <div class="p-info">
        <div class="p-name">${p.name}</div>
        <div class="p-cat">${p.category || 'Sem categoria'}</div>
      </div>
      <div class="p-price">${fmtBRL(p.promoPrice != null && p.promoPrice < p.price ? p.promoPrice : p.price)}</div>
    </label>
  `).join('');
}

function togglePromoProduct(id, checked) {
    if (checked) selectedPromoProductIds.add(id);
    else selectedPromoProductIds.delete(id);
}

document.getElementById('pr-product-search').addEventListener('input', renderPromoProductPicker);

function openPromoModal(id) {
    const form = document.getElementById('promo-form');
    form.reset();
    document.getElementById('pr-id').value = id || '';
    document.getElementById('pr-delete-btn').style.display = id ? 'block' : 'none';
    document.getElementById('promo-modal-title').textContent = id ? 'Editar promoção' : 'Nova promoção';
    document.getElementById('pr-product-search').value = '';

    if (id) {
        const p = allPromos.find(x => x.id === id);
        if (p) {
            document.getElementById('pr-title').value = p.title || '';
            document.getElementById('pr-desc').value = p.description || '';
            document.getElementById('pr-start').value = p.startDate || '';
            document.getElementById('pr-end').value = p.endDate || '';
            document.getElementById('pr-active').checked = p.active !== false;
            selectedPromoProductIds = new Set(p.productIds || []);
        }
    } else {
        document.getElementById('pr-active').checked = true;
        selectedPromoProductIds = new Set();
    }
    renderPromoProductPicker();
    document.getElementById('promo-modal').classList.add('open');
}

function closePromoModal() {
    document.getElementById('promo-modal').classList.remove('open');
}

document.getElementById('promo-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('pr-id').value;
    const payload = {
        title: document.getElementById('pr-title').value.trim(),
        description: document.getElementById('pr-desc').value.trim(),
        startDate: document.getElementById('pr-start').value || null,
        endDate: document.getElementById('pr-end').value || null,
        active: document.getElementById('pr-active').checked,
        productIds: [...selectedPromoProductIds]
    };
    if (id) {
        await db.collection('promotions').doc(id).set(payload, { merge: true });
    } else {
        await db.collection('promotions').add(payload);
    }
    closePromoModal();
});

async function deleteCurrentPromo() {
    const id = document.getElementById('pr-id').value;
    if (!id) return;
    if (!confirm('Excluir esta promoção?')) return;
    await db.collection('promotions').doc(id).delete();
    closePromoModal();
}

/* ================= CUPONS ================= */
let allCoupons = [];

function listenCoupons() {
    db.collection('coupons').onSnapshot(snap => {
        allCoupons = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderCouponsList();
    });
}

function renderCouponsList() {
    const root = document.getElementById('coupons-list');
    if (!root) return;
    if (allCoupons.length === 0) {
        root.innerHTML = `<p class="hint-text">Nenhum cupom cadastrado ainda.</p>`;
        return;
    }
    root.innerHTML = allCoupons.map(c => {
        const valueLabel = c.type === 'fixed' ? fmtBRL(c.value) : `${c.value}%`;
        const details = [
            c.active ? 'Ativo' : 'Inativo',
            c.expiresAt ? `válido até ${c.expiresAt}` : 'sem validade',
            c.minOrder ? `pedido mín. ${fmtBRL(c.minOrder)}` : null,
            c.showInPopup ? 'aparece no pop-up' : null
        ].filter(Boolean).join(' · ');
        return `
    <div class="promo-row" onclick="openCouponModal('${c.id}')">
      <div>
        <div class="pr-title">${c.code} — ${valueLabel} de desconto</div>
        <div class="pr-dates">${details}</div>
      </div>
    </div>
  `;
    }).join('');
}

function openCouponModal(id) {
    const form = document.getElementById('coupon-form');
    form.reset();
    document.getElementById('cp-id').value = id || '';
    document.getElementById('cp-delete-btn').style.display = id ? 'block' : 'none';
    document.getElementById('coupon-modal-title').textContent = id ? 'Editar cupom' : 'Novo cupom';

    if (id) {
        const c = allCoupons.find(x => x.id === id);
        if (c) {
            document.getElementById('cp-code').value = c.code || '';
            document.getElementById('cp-type').value = c.type || 'percent';
            document.getElementById('cp-value').value = c.value ?? '';
            document.getElementById('cp-min-order').value = c.minOrder ?? '';
            document.getElementById('cp-expires').value = c.expiresAt || '';
            document.getElementById('cp-desc').value = c.description || '';
            document.getElementById('cp-active').checked = c.active !== false;
            document.getElementById('cp-show-popup').checked = !!c.showInPopup;
        }
    } else {
        document.getElementById('cp-type').value = 'percent';
        document.getElementById('cp-active').checked = true;
        document.getElementById('cp-show-popup').checked = false;
    }
    document.getElementById('coupon-modal').classList.add('open');
}

function closeCouponModal() {
    document.getElementById('coupon-modal').classList.remove('open');
}

document.getElementById('coupon-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('cp-id').value;
    const code = document.getElementById('cp-code').value.trim().toUpperCase();
    if (!code) return;
    const minOrderVal = document.getElementById('cp-min-order').value;
    const payload = {
        code,
        type: document.getElementById('cp-type').value,
        value: Number(document.getElementById('cp-value').value) || 0,
        minOrder: minOrderVal ? Number(minOrderVal) : null,
        expiresAt: document.getElementById('cp-expires').value || null,
        description: document.getElementById('cp-desc').value.trim(),
        active: document.getElementById('cp-active').checked,
        showInPopup: document.getElementById('cp-show-popup').checked
    };
    if (id) {
        await db.collection('coupons').doc(id).set(payload, { merge: true });
    } else {
        await db.collection('coupons').add(payload);
    }
    closeCouponModal();
});

async function deleteCurrentCoupon() {
    const id = document.getElementById('cp-id').value;
    if (!id) return;
    if (!confirm('Excluir este cupom?')) return;
    await db.collection('coupons').doc(id).delete();
    closeCouponModal();
}

/* ================= FINANCEIRO ================= */
let allCash = [];
let cashType = 'entrada';

function setCashType(type) {
    cashType = type;
    document.querySelectorAll('#cash-type-toggle button').forEach(b => b.classList.toggle('active', b.dataset.type === type));
}

function openCashModal() {
    document.getElementById('cash-form').reset();
    document.getElementById('c-date').value = new Date().toISOString().slice(0, 10);
    setCashType('entrada');
    document.getElementById('cash-modal').classList.add('open');
}
function closeCashModal() {
    document.getElementById('cash-modal').classList.remove('open');
}

document.getElementById('cash-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    await db.collection('cashflow').add({
        type: cashType,
        description: document.getElementById('c-desc').value.trim(),
        value: Number(document.getElementById('c-value').value),
        date: document.getElementById('c-date').value,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    closeCashModal();
});

async function deleteCashEntry(id) {
    if (!confirm('Excluir este lançamento?')) return;
    await db.collection('cashflow').doc(id).delete();
}

function listenCashflow() {
    db.collection('cashflow').onSnapshot(snap => {
        allCash = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
        renderCashflow();
    });
}

function renderCashflow() {
    const totalIn = allCash.filter(c => c.type === 'entrada').reduce((s, c) => s + c.value, 0);
    const totalOut = allCash.filter(c => c.type === 'saida').reduce((s, c) => s + c.value, 0);
    document.getElementById('cash-total-in').textContent = fmtBRL(totalIn);
    document.getElementById('cash-total-out').textContent = fmtBRL(totalOut);
    document.getElementById('cash-balance').textContent = fmtBRL(totalIn - totalOut);

    const root = document.getElementById('cash-list');
    if (allCash.length === 0) {
        root.innerHTML = `<p class="hint-text">Nenhum lançamento ainda.</p>`;
        return;
    }
    root.innerHTML = allCash.map(c => `
    <div class="cash-row">
      <div>
        <div class="c-desc">${c.description}</div>
        <div class="c-date">${formatDateBR(c.date)}</div>
      </div>
      <div style="display:flex;align-items:center;gap:14px;">
        <span class="c-value ${c.type === 'entrada' ? 'in' : 'out'}">${c.type === 'entrada' ? '+' : '−'} ${fmtBRL(c.value)}</span>
        <span class="c-delete" onclick="deleteCashEntry('${c.id}')">excluir</span>
      </div>
    </div>
  `).join('');
}

function formatDateBR(iso) {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
}

/* ================= SOM DE NOVO PEDIDO ================= */
let orderSoundEnabled = localStorage.getItem('doces-leo-order-sound') !== 'off';
let orderSoundUnlocked = false;

function updateSoundToggleUI() {
    const label = document.getElementById('sound-toggle-label');
    const btn = document.getElementById('sound-toggle-btn');
    if (!label || !btn) return;
    label.textContent = orderSoundEnabled ? 'Ativado' : 'Desativado';
    btn.classList.toggle('sound-off', !orderSoundEnabled);
}

function toggleOrderSound() {
    orderSoundEnabled = !orderSoundEnabled;
    localStorage.setItem('doces-leo-order-sound', orderSoundEnabled ? 'on' : 'off');
    updateSoundToggleUI();
    if (orderSoundEnabled) unlockOrderSound();
}

// Navegadores só deixam tocar áudio depois de alguma interação do usuário na página.
// Esse "desbloqueio" toca e pausa o áudio silenciosamente no primeiro clique.
function unlockOrderSound() {
    if (orderSoundUnlocked) return;
    const audio = document.getElementById('new-order-sound');
    if (!audio) return;
    audio.play().then(() => {
        audio.pause();
        audio.currentTime = 0;
        orderSoundUnlocked = true;
    }).catch(() => { /* ainda bloqueado, tenta de novo no próximo clique */ });
}
document.addEventListener('click', unlockOrderSound);
updateSoundToggleUI();

function playNewOrderSound() {
    if (!orderSoundEnabled) return;
    const audio = document.getElementById('new-order-sound');
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(err => console.warn('Não foi possível tocar o som do novo pedido (o navegador pode estar bloqueando áudio automático):', err));
}

/* ================= PEDIDOS ================= */
let allOrders = [];
let orderFilter = 'all';
let isFirstOrdersSnapshot = true;
let knownOrderIds = new Set();

function listenOrders() {
    db.collection('orders').orderBy('createdAt', 'desc').limit(200).onSnapshot(snap => {
        if (isFirstOrdersSnapshot) {
            // Na primeira carga (ex: acabou de abrir/logar no painel), só registra os
            // pedidos existentes, sem tocar som — o som é só para pedidos que chegam depois.
            snap.docs.forEach(doc => knownOrderIds.add(doc.id));
            isFirstOrdersSnapshot = false;
        } else {
            let hasNewOrder = false;
            snap.docChanges().forEach(change => {
                if (change.type === 'added' && !knownOrderIds.has(change.doc.id)) {
                    knownOrderIds.add(change.doc.id);
                    hasNewOrder = true;
                }
            });
            if (hasNewOrder) playNewOrderSound();
        }
        allOrders = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderOrders();
        renderDashboard();
    }, err => console.error('Erro ao carregar pedidos:', err));
}

document.getElementById('order-filters').addEventListener('click', (e) => {
    const btn = e.target.closest('.chip-filter');
    if (!btn) return;
    orderFilter = btn.dataset.status;
    document.querySelectorAll('.chip-filter').forEach(b => b.classList.toggle('active', b === btn));
    renderOrders();
});

function whatsappLinkFor(phoneRaw, message) {
    let digits = (phoneRaw || '').replace(/\D/g, '');
    if (digits.length <= 11) digits = '55' + digits;
    return message ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}` : `https://wa.me/${digits}`;
}

const STATUS_LABELS = { novo: 'Novo', preparo: 'Em preparo', pronto: 'Pronto', saiu_entrega: 'Saiu para entrega', entregue: 'Entregue', cancelado: 'Cancelado' };
const PAYMENT_STATUS_LABELS = { pendente: 'Pagamento pendente', pago: 'Pago' };

// Fluxo de status depende do tipo de entrega: delivery ganha a etapa extra "saiu para entrega"
function nextStatusFor(order) {
    const chain = order.fulfillment === 'delivery'
        ? { novo: 'preparo', preparo: 'pronto', pronto: 'saiu_entrega', saiu_entrega: 'entregue' }
        : { novo: 'preparo', preparo: 'pronto', pronto: 'entregue' };
    return chain[order.status];
}

// "Pronto" tem um nome diferente pra retirada: o pedido não é "pronto" em si,
// fica disponível pro cliente vir buscar.
function statusLabelFor(status, fulfillment) {
    if (status === 'pronto' && fulfillment !== 'delivery') return 'Disponível para retirada';
    return STATUS_LABELS[status] || status;
}

function renderOrders() {
    const newCount = allOrders.filter(o => o.status === 'novo').length;
    document.getElementById('badge-pedidos').textContent = newCount || '';

    renderClients();

    const list = orderFilter === 'all' ? allOrders : allOrders.filter(o => o.status === orderFilter);
    const root = document.getElementById('orders-list');
    if (list.length === 0) {
        root.innerHTML = `<p class="hint-text">Nenhum pedido por aqui.</p>`;
        return;
    }

    root.innerHTML = list.map(o => {
        const time = o.createdAt && o.createdAt.toDate ? o.createdAt.toDate().toLocaleString('pt-BR') : '';
        const itemsHtml = (o.items || []).map(i => `${i.qty}x ${i.name} — ${fmtBRL(i.price * i.qty)}`).join('<br>');
        const next = nextStatusFor(o);
        const paymentStatus = o.paymentStatus || 'pendente';
        return `
      <div class="order-card">
        <div class="order-card-head">
          <div>
            <div class="order-customer">${o.customerName || 'Cliente'}</div>
            <div class="order-time">${time}</div>
          </div>
          <div class="order-pills">
            <span class="order-status-pill ${o.status}">${statusLabelFor(o.status, o.fulfillment)}</span>
            <span class="payment-status-pill ${paymentStatus}">${PAYMENT_STATUS_LABELS[paymentStatus]}</span>
          </div>
        </div>
        <div class="order-items">${itemsHtml}</div>
        <div class="order-meta">
          ${o.fulfillment === 'delivery' ? `Delivery — ${o.address || ''}` : 'Retirada no local'} · Tel: ${o.customerPhone || '-'}
          · Pagamento: ${o.paymentMethod === 'pix' ? 'Pix' : o.paymentMethod === 'dinheiro' ? 'Dinheiro' : 'não informado'}
          ${o.cashbackUsed ? ` · Cashback usado: −${fmtBRL(o.cashbackUsed)}` : ''}
        </div>
        <div class="order-total">${fmtBRL(o.total)}</div>
        <div class="order-actions">
          <a class="wa-link" href="${whatsappLinkFor(o.customerPhone)}" target="_blank" rel="noopener">Falar no WhatsApp</a>
          ${paymentStatus === 'pago'
            ? `<button onclick="setOrderPaymentStatus('${o.id}','pendente')">Marcar pagamento como pendente</button>`
            : `<button onclick="setOrderPaymentStatus('${o.id}','pago')">Marcar como pago</button>`}
          ${next ? `<button onclick="setOrderStatus('${o.id}','${next}')">Marcar como ${statusLabelFor(next, o.fulfillment).toLowerCase()}</button>` : ''}
          ${o.status !== 'cancelado' && o.status !== 'entregue' ? `<button onclick="setOrderStatus('${o.id}','cancelado')">Cancelar</button>` : ''}
          ${o.status === 'entregue' ? `<button onclick="launchOrderAsCash('${o.id}')">Lançar no caixa</button>` : ''}
          <button class="btn-danger" onclick="deleteOrder('${o.id}')">Excluir</button>
        </div>
      </div>`;
    }).join('');
}

async function deleteOrder(id) {
    if (!confirm('Excluir este pedido permanentemente? Essa ação não pode ser desfeita.')) return;
    await db.collection('orders').doc(id).delete();
}

async function setOrderStatus(id, status) {
    const order = allOrders.find(o => o.id === id);
    const update = { status };

    // Libera o cashback só quando o pedido é marcado como entregue de verdade —
    // pedido cancelado nunca passa por aqui, então nunca gera cashback.
    if (status === 'entregue' && order && order.cashbackAmount > 0 && !order.cashbackReleased) {
        const validDays = order.cashbackValidDays || 30;
        update.cashbackReleased = true;
        update.cashbackExpiresAt = firebase.firestore.Timestamp.fromDate(
            new Date(Date.now() + validDays * 24 * 60 * 60 * 1000)
        );
        update.cashbackRedeemed = false;
    }

    await db.collection('orders').doc(id).set(update, { merge: true });

    // Avisa o cliente no WhatsApp assim que o pedido sai para entrega
    if (status === 'saiu_entrega' && order && order.customerPhone) {
        const nome = order.customerName || '';
        const msg = `Oi${nome ? ' ' + nome : ''}! 🍬 Seu pedido na Doces do Léo saiu para entrega e já está a caminho até você. Chega em breve!`;
        window.open(whatsappLinkFor(order.customerPhone, msg), '_blank');
    }

    // Avisa o cliente no WhatsApp assim que o pedido de retirada fica disponível,
    // já com a localização da loja cadastrada nas configurações.
    if (status === 'pronto' && order && order.fulfillment !== 'delivery' && order.customerPhone) {
        const nome = order.customerName || '';
        const endereco = currentStoreConfig.address || '';
        const mapLink = currentStoreConfig.pickupMapLink || '';
        let msg = `Oi${nome ? ' ' + nome : ''}! 🍬 Seu pedido na Doces do Léo está pronto e disponível para retirada!`;
        if (endereco) msg += `\n📍 ${endereco}`;
        if (mapLink) msg += `\n${mapLink}`;
        window.open(whatsappLinkFor(order.customerPhone, msg), '_blank');
    }
}

async function setOrderPaymentStatus(id, paymentStatus) {
    await db.collection('orders').doc(id).set({ paymentStatus }, { merge: true });
}

/* ================= CLIENTES ================= */
let clientSort = 'orders';
let clientSearchTerm = '';
let registeredCustomers = [];

function listenCustomers() {
    db.collection('customers').onSnapshot(snap => {
        registeredCustomers = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderClients();
    }, err => console.error('Erro ao carregar clientes cadastrados:', err));
}

function normalizePhoneAdmin(phone) {
    return (phone || '').replace(/\D/g, '');
}

document.getElementById('client-filters').addEventListener('click', (e) => {
    const btn = e.target.closest('.chip-filter');
    if (!btn) return;
    clientSort = btn.dataset.sort;
    document.querySelectorAll('#client-filters .chip-filter').forEach(b => b.classList.toggle('active', b === btn));
    renderClients();
});

document.getElementById('client-search').addEventListener('input', (e) => {
    clientSearchTerm = e.target.value.trim().toLowerCase();
    renderClients();
});

function computeClients() {
    const now = new Date();
    const byPhone = {};

    registeredCustomers.forEach(customer => {
        const phone = customer.phoneNormalized || normalizePhoneAdmin(customer.phone);
        if (!phone) return;
        byPhone[phone] = {
            phone,
            phoneDisplay: customer.phone || phone,
            name: customer.name || 'Cliente',
            totalOrders: 0,
            totalSpent: 0,
            cashbackAvailable: 0,
            lastOrderAt: null
        };
    });

    allOrders.forEach(o => {
        const phone = o.customerPhoneNormalized || normalizePhoneAdmin(o.customerPhone);
        if (!phone) return;

        if (!byPhone[phone]) {
            byPhone[phone] = {
                phone,
                phoneDisplay: o.customerPhone || phone,
                name: o.customerName || 'Cliente',
                totalOrders: 0,
                totalSpent: 0,
                cashbackAvailable: 0,
                lastOrderAt: null
            };
        }
        const c = byPhone[phone];

        const createdAt = o.createdAt && o.createdAt.toDate ? o.createdAt.toDate() : null;
        if (createdAt && (!c.lastOrderAt || createdAt > c.lastOrderAt)) {
            c.lastOrderAt = createdAt;
            c.name = o.customerName || c.name;
            c.phoneDisplay = o.customerPhone || c.phoneDisplay;
        }

        if (o.status !== 'cancelado') {
            c.totalOrders += 1;
            c.totalSpent += o.total || 0;
        }

        if (o.cashbackAmount && o.cashbackReleased && !o.cashbackRedeemed) {
            const expiresAt = o.cashbackExpiresAt && o.cashbackExpiresAt.toDate ? o.cashbackExpiresAt.toDate() : null;
            if (expiresAt && expiresAt > now) {
                c.cashbackAvailable += o.cashbackAmount;
            }
        }
    });

    return Object.values(byPhone);
}

function renderClients() {
    let clients = computeClients();

    if (clientSearchTerm) {
        clients = clients.filter(c =>
            c.name.toLowerCase().includes(clientSearchTerm) || c.phoneDisplay.includes(clientSearchTerm)
        );
    }

    clients.sort((a, b) => {
        if (clientSort === 'cashback') return b.cashbackAvailable - a.cashbackAvailable;
        if (clientSort === 'spent') return b.totalSpent - a.totalSpent;
        if (clientSort === 'recent') return (b.lastOrderAt || 0) - (a.lastOrderAt || 0);
        return b.totalOrders - a.totalOrders;
    });

    const root = document.getElementById('clients-list');
    if (clients.length === 0) {
        root.innerHTML = `<p class="hint-text">Nenhum cliente encontrado.</p>`;
        return;
    }

    root.innerHTML = clients.map((c, i) => `
    <div class="client-row">
      <div class="client-rank">${i + 1}º</div>
      <div class="client-info">
        <div class="client-name">${c.name}</div>
        <div class="client-phone">${c.phoneDisplay}</div>
      </div>
      <div class="client-stats">
        <div class="client-stat">${c.totalOrders} pedido${c.totalOrders === 1 ? '' : 's'}<strong>${fmtBRL(c.totalSpent)}</strong></div>
        <span class="client-cashback ${c.cashbackAvailable > 0 ? '' : 'zero'}">${fmtBRL(c.cashbackAvailable)} cashback</span>
        <a class="wa-link" href="${whatsappLinkFor(c.phoneDisplay)}" target="_blank" rel="noopener">WhatsApp</a>
      </div>
    </div>
  `).join('');
}

async function launchOrderAsCash(id) {
    const o = allOrders.find(x => x.id === id);
    if (!o) return;
    if (o.cashLaunched) {
        alert('Este pedido já foi lançado no caixa.');
        return;
    }
    await db.collection('cashflow').add({
        type: 'entrada',
        description: `Pedido de ${o.customerName || 'cliente'}`,
        value: o.total,
        date: new Date().toISOString().slice(0, 10),
        relatedOrderId: id,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    await db.collection('orders').doc(id).set({ cashLaunched: true }, { merge: true });
    alert('Lançado no financeiro!');
}
