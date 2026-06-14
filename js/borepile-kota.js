// ==================== DATA HARGA ====================
const hargaMesin = {
    minicrane: { 30: 120000, 40: 135000, 50: 190000, 60: 250000, 80: 350000 },
    gawangan: { 30: 80000, 40: 100000, 50: 150000, 60: 200000 },
    sany: { 40: 400000, 50: 430000, 60: 450000, 80: 470000, 100: 490000, 120: 530000 }
};
const hargaManual = { 20: 70000, 25: 75000, 30: 80000, 40: 100000 };

// Data spesifikasi per alat
const machineSpecs = {
    minicrane: { name: "Mini Crane", maxDepth: 30, minOrder: 200, diameters: [30, 40, 50, 60, 80] },
    gawangan: { name: "Gawangan", maxDepth: 20, minOrder: 150, diameters: [30, 40, 50, 60] },
    sany: { name: "SANY Hidrolik", maxDepth: 60, minOrder: 400, diameters: [40, 50, 60, 80, 100, 120] }
};
const manualSpecs = { name: "Manual / Strauss Pile", maxDepth: 10, minOrder: 100, diameters: [20, 25, 30, 40] };

let currentMethod = 'mesin';      // 'mesin', 'manual'
let currentMachine = 'minicrane'; // 'minicrane', 'gawangan', 'sany'
let currentDiameter = 30;

const diameterSelect = document.getElementById('diameterSelect');
const priceInput = document.getElementById('priceInput');
const depthInput = document.getElementById('depthInput');
const pointsInput = document.getElementById('pointsInput');
const totalPriceDiv = document.getElementById('totalPrice');
const detailPriceDiv = document.getElementById('detailPrice');
const estimationTimeDiv = document.getElementById('estimationTime');
const machineSelectRow = document.getElementById('machineSelectRow');
const machineSelect = document.getElementById('machineSelect');

function formatRp(amount) {
    return 'Rp ' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function getCurrentSpecs() {
    if (currentMethod === 'mesin') {
        return machineSpecs[currentMachine];
    } else {
        return manualSpecs;
    }
}

function getCurrentPrice() {
    if (currentMethod === 'mesin') {
        const prices = hargaMesin[currentMachine];
        return prices[currentDiameter] || 120000;
    } else {
        return hargaManual[currentDiameter] || 80000;
    }
}

function updateDiameterOptions() {
    let optionsHtml = '';
    let diameters;
    
    if (currentMethod === 'mesin') {
        diameters = machineSpecs[currentMachine].diameters;
    } else {
        diameters = manualSpecs.diameters;
    }
    
    diameters.forEach(d => {
        optionsHtml += `<option value="${d}">${d} cm</option>`;
    });
    
    diameterSelect.innerHTML = optionsHtml;
    currentDiameter = parseInt(diameterSelect.value);
    updateCalculator();
}

function updateCalculator() {
    currentDiameter = parseInt(diameterSelect.value);
    let pricePerM = getCurrentPrice();
    
    const priceRaw = priceInput.value.trim();
    if (priceRaw !== '') { 
        let custom = parseInt(priceRaw); 
        if (!isNaN(custom) && custom >= 50000) pricePerM = custom; 
    }
    
    let depth = parseFloat(depthInput.value);
    if (isNaN(depth) || depth <= 0) { 
        totalPriceDiv.innerHTML = 'Rp 0'; 
        detailPriceDiv.innerHTML = 'Masukkan kedalaman'; 
        estimationTimeDiv.innerHTML = 'Estimasi waktu: -'; 
        return; 
    }
    
    const specs = getCurrentSpecs();
    let depthForCalc = depth;
    let warningMsg = '';
    if (depthForCalc > specs.maxDepth) { 
        depthForCalc = specs.maxDepth; 
        warningMsg = ` (dibatasi ${specs.maxDepth}m maksimal)`;
    }
    
    const points = parseInt(pointsInput.value);
    const totalPrice = pricePerM * depthForCalc * points;
    totalPriceDiv.innerHTML = formatRp(totalPrice);
    
    const totalMeter = depthForCalc * points;
    let minOrderMsg = '';
    if (totalMeter < specs.minOrder) {
        minOrderMsg = ` ⚠️ Minimal order ${specs.minOrder}m, total Anda ${totalMeter}m. Hubungi kami untuk harga borongan.`;
    }
    
    detailPriceDiv.innerHTML = `${formatRp(pricePerM)}/m × ${depthForCalc}m × ${points} titik = ${formatRp(totalPrice)}${warningMsg}${minOrderMsg}`;
    
    let days;
    if (currentMethod === 'manual') {
        days = Math.ceil(points / 2.5);
    } else {
        if (currentMachine === 'sany') days = Math.ceil(points / 8);
        else if (currentMachine === 'gawangan') days = Math.ceil(points / 3);
        else days = Math.ceil(points / 3.5);
    }
    estimationTimeDiv.innerHTML = `Estimasi waktu: ${days} hari kerja${warningMsg}`;
}

// ==================== EVENT LISTENERS ====================
if (diameterSelect) {
    diameterSelect.addEventListener('change', () => { 
        currentDiameter = parseInt(diameterSelect.value); 
        priceInput.value = ''; 
        updateCalculator(); 
    });
}
if (priceInput) {
    priceInput.addEventListener('input', function() { 
        this.value = this.value.replace(/[^0-9]/g, ''); 
        updateCalculator(); 
    });
}
if (depthInput) {
    depthInput.addEventListener('input', function() { 
        this.value = this.value.replace(/[^0-9]/g, ''); 
        updateCalculator(); 
    });
}
if (pointsInput) pointsInput.addEventListener('input', updateCalculator);

// Method selector (Mesin / Manual)
document.querySelectorAll('.method-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.method-btn').forEach(b => { 
            b.classList.remove('active'); 
            b.setAttribute('aria-pressed', 'false'); 
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        currentMethod = btn.dataset.method;
        
        // Tampilkan/sembunyikan pilihan mesin
        if (machineSelectRow) {
            machineSelectRow.style.display = currentMethod === 'mesin' ? 'flex' : 'none';
        }
        
        if (currentMethod === 'mesin') {
            currentMachine = machineSelect ? machineSelect.value : 'minicrane';
        }
        
        priceInput.value = '';
        updateDiameterOptions();
    });
});

// Machine selector (Mini Crane / Gawangan / SANY)
if (machineSelect) {
    machineSelect.addEventListener('change', () => {
        currentMachine = machineSelect.value;
        priceInput.value = '';
        updateDiameterOptions();
    });
}

// ==================== SEND TO WA ====================
function sendToWA() {
    const specs = getCurrentSpecs();
    const diameter = diameterSelect ? diameterSelect.value : '30';
    const pricePerM = priceInput ? (priceInput.value || '(harga standar)') : '(harga standar)';
    const depth = depthInput ? depthInput.value : '(belum diisi)';
    const points = pointsInput ? pointsInput.value : '0';
    const totalPrice = totalPriceDiv ? totalPriceDiv.innerText : 'Rp 0';
    
    const msg = `Halo Agung Perkasa,%0A%0ASaya dari website ingin tanya estimasi bore pile di Jakarta:%0A- Metode: ${specs.name}%0A- Diameter: ${diameter} cm%0A- Harga jasa/m: Rp ${pricePerM}%0A- Kedalaman: ${depth} m%0A- Jumlah titik: ${points} titik%0A%0AEstimasi total: ${totalPrice}%0A%0ATolong info penawaran resmi. Terima kasih.`;
    
    window.open(`https://wa.me/6282233569632?text=${msg}`, '_blank');
}
window.sendToWA = sendToWA;

// ==================== INIT ====================
updateDiameterOptions();

// ==================== SCROLL TOP ====================
const scrollTopBtn = document.getElementById('scrollTop');
if (scrollTopBtn) {
    window.addEventListener('scroll', () => { 
        if (window.scrollY > 300) scrollTopBtn.classList.add('active'); 
        else scrollTopBtn.classList.remove('active'); 
    });
    scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ==================== FAQ ACCORDION ====================
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

// ==================== MOBILE MENU ====================
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');
if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        const expanded = navMenu.classList.contains('active');
        navMenu.classList.toggle('active');
        mobileMenu.setAttribute('aria-expanded', !expanded);
    });
}

// ==================== DROPDOWN MOBILE ====================
document.querySelectorAll('.dropdown .dropbtn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        if(window.innerWidth <= 768) {
            // GA USAH PAKAI e.preventDefault() LAGI
            this.parentElement.classList.toggle('active');
        }
    });
});

// ============================================================
// NAVBAR SHRINK - LEBIH SMOOTH
// ============================================================

(function() {
    'use strict';
    
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    let lastScrollY = 0;
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const currentScrollY = window.scrollY || window.pageYOffset;
                
                // Smooth transition dengan easing
                if (currentScrollY > 50 && currentScrollY > lastScrollY) {
                    navbar.classList.add('shrink');
                } else if (currentScrollY <= 50) {
                    navbar.classList.remove('shrink');
                }
                
                lastScrollY = currentScrollY;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
    
})();
