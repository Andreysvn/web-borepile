const hargaMesin = { 30: 120000, 40: 135000, 50: 190000, 60: 250000, 80: 350000 };
const hargaManual = { 20: 70000, 25: 75000, 30: 80000, 40: 100000 };
let currentMethod = 'mesin';
let currentDiameter = 30;

const diameterSelect = document.getElementById('diameterSelect');
const priceInput = document.getElementById('priceInput');
const depthInput = document.getElementById('depthInput');
const pointsInput = document.getElementById('pointsInput');
const totalPriceDiv = document.getElementById('totalPrice');
const detailPriceDiv = document.getElementById('detailPrice');
const estimationTimeDiv = document.getElementById('estimationTime');

function formatRp(amount) {
    return 'Rp ' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function updateDiameterOptions() {
    if (currentMethod === 'mesin') {
        diameterSelect.innerHTML = `<option value="30" selected>30 cm</option><option value="40">40 cm</option><option value="50">50 cm</option><option value="60">60 cm</option><option value="80">80 cm</option>`;
        currentDiameter = 30;
        diameterSelect.value = '30';
    } else {
        diameterSelect.innerHTML = `<option value="20">20 cm</option><option value="25">25 cm</option><option value="30" selected>30 cm</option><option value="40">40 cm</option>`;
        currentDiameter = 30;
        diameterSelect.value = '30';
    }
    updateCalculator();
}

function getDefaultPrice() {
    if (currentMethod === 'mesin') return hargaMesin[currentDiameter] || 120000;
    return hargaManual[currentDiameter] || 85000;
}

function updateCalculator() {
    currentDiameter = parseInt(diameterSelect.value);
    let pricePerM = getDefaultPrice();
    const priceRaw = priceInput.value.trim();
    if (priceRaw !== '') { let custom = parseInt(priceRaw); if (!isNaN(custom) && custom >= 50000) pricePerM = custom; }
    
    let depth = parseFloat(depthInput.value);
    if (isNaN(depth) || depth <= 0) { totalPriceDiv.innerHTML = 'Rp 0'; detailPriceDiv.innerHTML = 'Masukkan kedalaman'; estimationTimeDiv.innerHTML = 'Estimasi waktu: -'; return; }
    
    let depthForCalc = depth, warningMsg = '';
    if (currentMethod === 'mesin' && depthForCalc > 30) { depthForCalc = 30; warningMsg = ' (dibatasi 30m maksimal)'; }
    if (currentMethod === 'manual' && depthForCalc > 10) { depthForCalc = 10; warningMsg = ' (dibatasi 10m maksimal)'; }
    
    const points = parseInt(pointsInput.value);
    const totalPrice = pricePerM * depthForCalc * points;
    totalPriceDiv.innerHTML = formatRp(totalPrice);
    detailPriceDiv.innerHTML = `${formatRp(pricePerM)}/m × ${depthForCalc}m × ${points} titik = ${formatRp(totalPrice)}${warningMsg}`;
    
    let days = currentMethod === 'mesin' ? Math.ceil(points / (depthForCalc < 10 ? 3.5 : 2.5)) : Math.ceil(points / 2.5);
    estimationTimeDiv.innerHTML = `Estimasi waktu: ${days} hari kerja${warningMsg}`;
}

if (diameterSelect) diameterSelect.addEventListener('change', () => { currentDiameter = parseInt(diameterSelect.value); priceInput.value = ''; updateCalculator(); });
if (priceInput) priceInput.addEventListener('input', function() { this.value = this.value.replace(/[^0-9]/g, ''); updateCalculator(); });
if (depthInput) depthInput.addEventListener('input', function() { this.value = this.value.replace(/[^0-9]/g, ''); updateCalculator(); });
if (pointsInput) pointsInput.addEventListener('input', updateCalculator);

document.querySelectorAll('.method-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.method-btn').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        currentMethod = btn.dataset.method;
        updateDiameterOptions();
    });
});

function sendToWA() {
    const method = currentMethod === 'mesin' ? 'Bore Pile Mesin (Mini Crane)' : 'Bore Pile Manual';
    const diameter = diameterSelect ? diameterSelect.value : '30';
    const pricePerM = priceInput ? (priceInput.value || '(harga standar)') : '(harga standar)';
    const depth = depthInput ? depthInput.value : '(belum diisi)';
    const points = pointsInput ? pointsInput.value : '0';
    const totalPrice = totalPriceDiv ? totalPriceDiv.innerText : 'Rp 0';
    const msg = `Halo Agung Perkasa,%0A%0ASaya dari website ingin tanya estimasi bore pile di Jakarta:%0A- Metode: ${method}%0A- Diameter: ${diameter} cm%0A- Harga jasa/m: Rp ${pricePerM}%0A- Kedalaman: ${depth} m%0A- Jumlah titik: ${points} titik%0A%0AEstimasi total: ${totalPrice}%0A%0ATolong info penawaran resmi. Terima kasih.`;
    window.open(`https://wa.me/6282233569632?text=${msg}`, '_blank');
}
window.sendToWA = sendToWA;

updateDiameterOptions();

const scrollTopBtn = document.getElementById('scrollTop');
if (scrollTopBtn) {
    window.addEventListener('scroll', () => { if (window.scrollY > 300) scrollTopBtn.classList.add('active'); else scrollTopBtn.classList.remove('active'); });
    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
        requestAnimationFrame(() => {
            const expanded = btn.getAttribute('aria-expanded') === 'true' ? false : true;
            btn.setAttribute('aria-expanded', expanded);
            btn.classList.toggle('active');
            const answer = btn.nextElementSibling;
            if (answer) answer.classList.toggle('show');
        });
    });
});

const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');
if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        const expanded = navMenu.classList.contains('active');
        navMenu.classList.toggle('active');
        mobileMenu.setAttribute('aria-expanded', !expanded);
    });
}