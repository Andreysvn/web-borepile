const hargaMesin = { 30: 120000, 40: 135000, 50: 190000, 60: 250000, 80: 350000 };
const hargaManual = { 20: 70000, 25: 75000, 30: 80000, 40: 100000 };

let currentMethod = 'mesin';
let currentDiameter = 40;

const diameterSelect = document.getElementById('diameterSelect');
const priceInput = document.getElementById('priceInput');
const depthInput = document.getElementById('depthInput');
const pointsInput = document.getElementById('pointsInput');
const totalPriceDiv = document.getElementById('totalPrice');
const detailPriceDiv = document.getElementById('detailPrice');
const estimationTimeDiv = document.getElementById('estimationTime');
const depthHint = document.getElementById('depthHint');

function formatRp(amount) {
    return 'Rp ' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function updateDiameterOptions() {
    if (currentMethod === 'mesin') {
        diameterSelect.innerHTML = `<option value="30">30 cm</option><option value="40" selected>40 cm</option><option value="50">50 cm</option><option value="60">60 cm</option><option value="80">80 cm</option>`;
        depthHint.innerHTML = 'Maksimal kedalaman 30 meter (bore pile mesin)';
        currentDiameter = 40;
        diameterSelect.value = '40';
        if (priceInput.value === '') {
            priceInput.value = '';
        }
    } else {
        diameterSelect.innerHTML = `<option value="20">20 cm</option><option value="25">25 cm</option><option value="30">30 cm</option><option value="40" selected>40 cm</option>`;
        depthHint.innerHTML = 'Maksimal kedalaman 10 meter (bore pile manual)';
        currentDiameter = 40;
        diameterSelect.value = '40';
        if (priceInput.value === '') {
            priceInput.value = '';
        }
    }
    updateCalculator();
}

function getDefaultPrice() {
    if (currentMethod === 'mesin') return hargaMesin[currentDiameter] || 135000;
    return hargaManual[currentDiameter] || 100000;
}

function estimateTime(points, depth) {
    if (currentMethod === 'mesin') {
        let rate = depth < 10 ? 3.5 : (depth <= 20 ? 2.5 : 1.5);
        return Math.ceil(points / rate);
    }
    return Math.ceil(points / 2.5);
}

function updateCalculator() {
    currentDiameter = parseInt(diameterSelect.value);
    
    let pricePerM;
    const priceRaw = priceInput.value.trim();
    if (priceRaw === '') {
        pricePerM = getDefaultPrice();
    } else {
        pricePerM = parseInt(priceRaw);
        if (isNaN(pricePerM) || pricePerM < 10000) {
            pricePerM = getDefaultPrice();
        }
    }
    
    let depth;
    const depthRaw = depthInput.value.trim();
    if (depthRaw === '') {
        totalPriceDiv.innerHTML = 'Rp 0';
        detailPriceDiv.innerHTML = 'Masukkan kedalaman terlebih dahulu';
        estimationTimeDiv.innerHTML = 'Estimasi waktu: -';
        return;
    } else {
        depth = parseFloat(depthRaw);
        if (isNaN(depth) || depth <= 0) {
            totalPriceDiv.innerHTML = 'Rp 0';
            detailPriceDiv.innerHTML = 'Kedalaman tidak valid';
            estimationTimeDiv.innerHTML = 'Estimasi waktu: -';
            return;
        }
    }
    
    let depthForCalc = depth;
    let warningMsg = '';
    if (currentMethod === 'mesin' && depthForCalc > 30) {
        depthForCalc = 30;
        warningMsg = ' (dibatasi 30m maksimal)';
    }
    if (currentMethod === 'manual' && depthForCalc > 10) {
        depthForCalc = 10;
        warningMsg = ' (dibatasi 10m maksimal)';
    }
    
    const points = parseInt(pointsInput.value);
    const totalPrice = pricePerM * depthForCalc * points;
    
    totalPriceDiv.innerHTML = formatRp(totalPrice);
    detailPriceDiv.innerHTML = `${formatRp(pricePerM)}/m × ${depthForCalc}m × ${points} titik = ${formatRp(totalPrice)}${warningMsg}`;
    
    const days = estimateTime(points, depthForCalc);
    estimationTimeDiv.innerHTML = `Estimasi waktu: ${days} hari kerja${warningMsg}`;
}

diameterSelect.addEventListener('change', () => {
    currentDiameter = parseInt(diameterSelect.value);
    priceInput.value = '';
    updateCalculator();
});

priceInput.addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9]/g, '');
    updateCalculator();
});

depthInput.addEventListener('input', function() {
    this.value = this.value.replace(/[^0-9]/g, '');
    updateCalculator();
});

pointsInput.addEventListener('input', updateCalculator);

document.querySelectorAll('.method-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.method-btn').forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        currentMethod = btn.dataset.method;
        updateDiameterOptions();
    });
});

function sendToWA() {
    const method = currentMethod === 'mesin' ? 'Bore Pile Mesin (Mini Crane)' : 'Bore Pile Manual';
    const diameter = diameterSelect.value;
    let pricePerM = priceInput.value || '(harga standar)';
    const depth = depthInput.value || '(belum diisi)';
    const points = pointsInput.value;
    const totalPrice = document.getElementById('totalPrice').innerText;
    const msg = `Halo Agung Perkasa,%0A%0ASaya apakah benar ini estimasi biaya jasa bore pilenya?:%0A- Metode: ${method}%0A- Diameter: ${diameter} cm%0A- Harga jasa/m: Rp ${pricePerM}%0A- Kedalaman: ${depth} m%0A- Jumlah titik: ${points} titik%0A%0AEstimasi total: ${totalPrice}%0A%0ATolong berikan info penawaran resmi dari Agung Perkasa. Terima kasih.`;
    window.open(`https://wa.me/6282233569632?text=${msg}`, '_blank');
}
window.sendToWA = sendToWA;

updateDiameterOptions();

// OPTIMASI FAQ untuk INP
const faqButtons = document.querySelectorAll('.faq-question');
faqButtons.forEach(btn => {
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

const scrollTop = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) scrollTop.classList.add('active');
    else scrollTop.classList.remove('active');
});
scrollTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));