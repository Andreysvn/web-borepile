// ============================================================
// HARGA.JS - KALKULATOR BORE PILE LENGKAP
// ============================================================

(function() {
    'use strict';

    // ===== 1. NAVBAR SHRINK =====
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        let ticking = false;
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    const scrollY = window.scrollY || window.pageYOffset;
                    if (scrollY > 50) {
                        navbar.classList.add('shrink');
                    } else {
                        navbar.classList.remove('shrink');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // ===== 2. MOBILE MENU =====
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileMenu && navMenu) {
        const newToggle = mobileMenu.cloneNode(true);
        mobileMenu.parentNode.replaceChild(newToggle, mobileMenu);
        const newMenu = navMenu.cloneNode(true);
        navMenu.parentNode.replaceChild(newMenu, navMenu);

        const menuBtn = document.getElementById('mobile-menu');
        const menuList = document.querySelector('.nav-menu');

        if (menuBtn && menuList) {
            menuBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const isActive = menuList.classList.toggle('active');
                menuBtn.classList.toggle('active');
                menuBtn.setAttribute('aria-expanded', isActive);
                document.body.style.overflow = isActive ? 'hidden' : '';
            });

            menuList.querySelectorAll('a').forEach(function(link) {
                link.addEventListener('click', function() {
                    menuList.classList.remove('active');
                    menuBtn.classList.remove('active');
                    menuBtn.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                });
            });

            document.addEventListener('click', function(e) {
                if (menuList.classList.contains('active')) {
                    const isInside = menuList.contains(e.target) || menuBtn.contains(e.target);
                    if (!isInside) {
                        menuList.classList.remove('active');
                        menuBtn.classList.remove('active');
                        menuBtn.setAttribute('aria-expanded', 'false');
                        document.body.style.overflow = '';
                    }
                }
            });
        }
    }

    // ===== 3. DROPDOWN MOBILE =====
    document.querySelectorAll('.dropdown .dropbtn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const parent = this.closest('.dropdown');
                parent.classList.toggle('active');
                document.querySelectorAll('.dropdown').forEach(function(d) {
                    if (d !== parent) {
                        d.classList.remove('active');
                    }
                });
            }
        });
    });

    // ===== 4. SCROLL TOP =====
    const scrollTopBtn = document.getElementById('scrollTop');
    if (scrollTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('active');
            } else {
                scrollTopBtn.classList.remove('active');
            }
        });
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== 5. FAQ ACCORDION =====
    document.querySelectorAll('.faq-question').forEach(function(btn) {
        btn.addEventListener('click', function() {
            requestAnimationFrame(function() {
                const expanded = btn.getAttribute('aria-expanded') === 'true' ? false : true;
                btn.setAttribute('aria-expanded', expanded);
                btn.classList.toggle('active');
                const answer = btn.nextElementSibling;
                if (answer) {
                    answer.classList.toggle('show');
                }
            });
        });
    });

    // ============================================================
    // ===== 6. KALKULATOR BORE PILE =====
    // ============================================================

    // ELEMEN
    const diameterSelect = document.getElementById('diameterSelect');
    const priceInput = document.getElementById('priceInput');
    const depthInput = document.getElementById('depthInput');
    const pointsInput = document.getElementById('pointsInput');
    const totalPrice = document.getElementById('totalPrice');
    const detailPrice = document.getElementById('detailPrice');
    const estimationTime = document.getElementById('estimationTime');
    const orderInfo = document.getElementById('orderInfo');
    const methodBtns = document.querySelectorAll('.method-btn');
    const machineSelect = document.getElementById('machineSelect');

    // ===== HARGA PER METER =====
    const hargaMesin = {
        30: 120000,
        40: 135000,
        50: 190000,
        60: 0,
        80: 0,
    };

    const hargaManual = {
        20: 75000,
        25: 85000,
        30: 100000,
        40: 120000,
    };

    const hargaSany = {
        30: 0,
        40: 0,
        50: 0,
        60: 0,
        80: 0,
        90: 0,
        100: 0,
        110: 0,
    };

    // ===== DIAMETER OPTIONS =====
    const diameterMesin = [30, 40, 50, 60, 80];
    const diameterManual = [20, 25, 30, 40];
    const diameterSany = [30, 40, 50, 60, 80, 90, 100, 110];

    // ===== STATE =====
    let currentMethod = 'mesin';
    let currentMachine = 'minicrane';

    // ===== FUNCTIONS =====
    function formatRupiah(angka) {
        if (isNaN(angka) || angka === 0) return 'Rp 0';
        return 'Rp ' + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    // ===== UPDATE MACHINE OPTIONS (TAMBAH/SEMBUNYIIN OPSI) =====
    function updateMachineOptions() {
        if (!machineSelect) return;

        // Hapus semua opsi yang ada (kecuali opsi default yang mau dipertahankan)
        // Kita rebuild ulang
        const currentValue = currentMachine;
        
        // Kosongkan dulu
        machineSelect.innerHTML = '';

        // Tentukan opsi berdasarkan metode
        let options = [];
        if (currentMethod === 'manual') {
            // Kalo manual, cuma 1 opsi: Strauss
            options = [
                { value: 'strauss', label: 'Strauss Pile (Manual)' }
            ];
            // Ubah label jadi "Pilih Jenis Alat" (karena cuma 1 opsi)
            const label = document.querySelector('#machineSelectRow label');
            if (label) label.textContent = 'Pilih Jenis Alat';
        } else {
            // Kalo mesin, tampilin semua opsi mesin
            options = [
                { value: 'minicrane', label: 'Mini Crane' },
                { value: 'gawangan', label: 'Gawangan' },
                { value: 'sany', label: 'Hidrolik (SANY)' }
            ];
            // Ubah label balik ke "Pilih Jenis Mesin"
            const label = document.querySelector('#machineSelectRow label');
            if (label) label.textContent = 'Pilih Jenis Mesin';
        }

        // Tambahkan opsi ke dropdown
        options.forEach(function(opt) {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.label;
            machineSelect.appendChild(option);
        });

        // Set value yang sesuai
        const isAvailable = options.some(function(opt) { return opt.value === currentValue; });
        if (isAvailable) {
            machineSelect.value = currentValue;
        } else if (options.length > 0) {
            machineSelect.value = options[0].value;
            currentMachine = options[0].value;
        }
    }

    function updateDiameterOptions() {
        if (!diameterSelect) return;

        let options = [];
        if (currentMethod === 'manual') {
            options = diameterManual;
        } else if (currentMachine === 'sany') {
            options = diameterSany;
        } else {
            options = diameterMesin;
        }

        const currentValue = parseInt(diameterSelect.value);
        const currentAvailable = options.includes(currentValue);
        
        diameterSelect.innerHTML = '';

        options.forEach(function(d) {
            const option = document.createElement('option');
            option.value = d;
            option.textContent = d + ' cm';
            if (d === currentValue && currentAvailable) {
                option.selected = true;
            }
            diameterSelect.appendChild(option);
        });

        if (!currentAvailable && options.length > 0) {
            diameterSelect.value = options[0];
        }

        if (priceInput) {
            priceInput.value = '';
            priceInput.dataset.numeric = '';
        }

        hitungTotal();
    }

    function getHargaPerMeter(diameter) {
        if (currentMethod === 'manual' || currentMachine === 'strauss') {
            return hargaManual[diameter] || 0;
        } else if (currentMachine === 'sany') {
            return hargaSany[diameter] || 0;
        } else {
            return hargaMesin[diameter] || 0;
        }
    }

    function getMinimalOrder() {
        if (currentMethod === 'manual' || currentMachine === 'strauss') return 100;
        if (currentMachine === 'sany') return 1200;
        if (currentMachine === 'gawangan') return 150;
        return 200;
    }

    function getKecepatanPerHari() {
        if (currentMethod === 'manual' || currentMachine === 'strauss') return { min: 2, max: 3 };
        if (currentMachine === 'sany') return { min: 15, max: 25 };
        return { min: 2, max: 4 };
    }

    function getNamaAlat() {
        if (currentMethod === 'manual' || currentMachine === 'strauss') return 'Strauss Pile (Manual)';
        if (currentMachine === 'sany') return 'SANY Hidrolik';
        if (currentMachine === 'gawangan') return 'Gawangan';
        return 'Mini Crane';
    }

    function hitungTotal() {
        if (!diameterSelect || !depthInput || !pointsInput || !totalPrice) {
            return;
        }

        const diameter = parseInt(diameterSelect.value) || 0;
        const kedalaman = parseFloat(depthInput.value) || 0;
        const jumlahTitik = parseInt(pointsInput.value) || 0;
        const priceRaw = priceInput ? priceInput.dataset.numeric || '' : '';
        
        let hargaPerMeter = 0;

        if (priceRaw) {
            hargaPerMeter = parseInt(priceRaw);
        } else {
            hargaPerMeter = getHargaPerMeter(diameter);
        }

        const alatName = getNamaAlat();

        if (hargaPerMeter === 0) {
            if (totalPrice) totalPrice.textContent = 'Hubungi Kami';
            if (detailPrice) detailPrice.textContent = 'Hubungi Kami untuk harga diameter ' + diameter + ' cm';
            if (estimationTime) estimationTime.textContent = 'Estimasi waktu: konsultasi';
            if (orderInfo) orderInfo.textContent = 'Minimal order: ' + getMinimalOrder() + 'm (' + alatName + ')';
            return;
        }

        if (kedalaman === 0 || jumlahTitik === 0) {
            if (totalPrice) totalPrice.textContent = 'Rp 0';
            if (detailPrice) detailPrice.textContent = 'Masukkan kedalaman & jumlah titik';
            if (estimationTime) estimationTime.textContent = 'Estimasi waktu: -';
            if (orderInfo) orderInfo.textContent = '';
            return;
        }

        let depthForCalc = kedalaman;
        let warningMsg = '';
        
        if ((currentMethod === 'manual' || currentMachine === 'strauss') && depthForCalc > 10) {
            depthForCalc = 10;
            warningMsg = ' (dibatasi 10m maksimal)';
        } else if (currentMethod === 'mesin' && currentMachine !== 'sany' && depthForCalc > 30) {
            depthForCalc = 30;
            warningMsg = ' (dibatasi 30m maksimal)';
        } else if (currentMachine === 'sany' && depthForCalc > 27) {
            depthForCalc = 27;
            warningMsg = ' (dibatasi 27m maksimal)';
        }

        const totalMeter = depthForCalc * jumlahTitik;
        const total = hargaPerMeter * totalMeter;

        if (totalPrice) totalPrice.textContent = formatRupiah(total);

        if (detailPrice) {
            detailPrice.textContent = formatRupiah(hargaPerMeter) + '/m × ' + depthForCalc + 'm × ' + jumlahTitik + ' titik' + warningMsg;
        }

        // ===== ESTIMASI WAKTU (per TITIK) =====
const kecepatan = getKecepatanPerHari();

let estimasiMin, estimasiMax;

if (jumlahTitik === 0) {
    estimasiMin = 0;
    estimasiMax = 0;
} else if (currentMachine === 'sany') {
    estimasiMin = 0;
    estimasiMax = 0;
} else {
    estimasiMin = Math.ceil(jumlahTitik / kecepatan.max);
    estimasiMax = Math.ceil(jumlahTitik / kecepatan.min);
}

if (estimationTime) {
    if (jumlahTitik === 0) {
        estimationTime.textContent = 'Estimasi waktu: -';
    } else if (currentMachine === 'sany') {
        estimationTime.textContent = 'Estimasi waktu: konsultasi';
    } else if (estimasiMin < 1 && estimasiMax < 1) {
        estimationTime.textContent = 'Estimasi waktu: 1 hari kerja';
    } else if (estimasiMin === estimasiMax) {
        estimationTime.textContent = 'Estimasi waktu: ' + estimasiMin + ' hari kerja';
    } else {
        estimationTime.textContent = 'Estimasi waktu: ' + estimasiMin + ' - ' + estimasiMax + ' hari kerja';
    }
}

        const minimalOrder = getMinimalOrder();
        if (orderInfo) {
            if (totalMeter < minimalOrder) {
                orderInfo.textContent = '⚠️ Order di bawah ' + minimalOrder + 'm (' + alatName + '), hubungi admin untuk penawaran khusus atau borongan';
                orderInfo.className = 'order-info alert';
            } else {
                orderInfo.textContent = '✅ Volume order: ' + totalMeter + 'm (' + alatName + ' - cukup)';
                orderInfo.className = 'order-info success';
            }
        }
    }

    // ===== UPDATE UI =====
    function updateUI() {
        // Update dropdown machine options (tambah/sembunyiin)
        updateMachineOptions();
        
        // Update diameter options
        updateDiameterOptions();

        if (priceInput) {
            priceInput.value = '';
            priceInput.dataset.numeric = '';
        }

        hitungTotal();
    }

    // ===== EVENT LISTENERS =====

    // METHOD BTN
    methodBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            methodBtns.forEach(function(b) {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            
            currentMethod = this.dataset.method;

            // Set default machine
            if (currentMethod === 'manual') {
                currentMachine = 'strauss';
            } else {
                currentMachine = 'minicrane';
            }

            updateUI();
        });
    });

    // MACHINE SELECT
    if (machineSelect) {
        machineSelect.addEventListener('change', function() {
            currentMachine = this.value;
            updateUI();
        });
    }

    // DIAMETER SELECT
    if (diameterSelect) {
        diameterSelect.addEventListener('change', function() {
            if (priceInput) {
                priceInput.value = '';
                priceInput.dataset.numeric = '';
            }
            hitungTotal();
        });
    }

    // PRICE INPUT
    if (priceInput) {
        priceInput.addEventListener('input', function() {
            const raw = this.value.replace(/[^0-9]/g, '');
            if (raw && parseInt(raw) > 0) {
                this.dataset.numeric = raw;
                this.value = 'Rp ' + parseInt(raw).toLocaleString('id-ID');
            } else {
                this.dataset.numeric = '';
                this.value = '';
            }
            hitungTotal();
        });

        priceInput.addEventListener('focus', function() {
            if (this.value.startsWith('Rp ')) {
                this.value = this.dataset.numeric || '';
            }
        });

        priceInput.addEventListener('blur', function() {
            const num = this.dataset.numeric;
            if (num && parseInt(num) > 0) {
                this.value = 'Rp ' + parseInt(num).toLocaleString('id-ID');
            } else {
                this.value = '';
            }
        });
    }

    // DEPTH INPUT
    if (depthInput) {
        depthInput.addEventListener('input', function() {
            let val = this.value.replace(/[^0-9.]/g, '');
            if (parseFloat(val) < 0) val = '0';
            this.value = val;
            hitungTotal();
        });
    }

    // POINTS INPUT
    if (pointsInput) {
        pointsInput.addEventListener('input', function() {
            let val = this.value.replace(/[^0-9]/g, '');
            if (parseInt(val) < 0) val = '0';
            this.value = val;
            hitungTotal();
        });
    }

    // ===== SEND TO WA =====
    window.sendToWA = function() {
        const alatName = getNamaAlat();
        const diameter = diameterSelect ? diameterSelect.value : '-';
        let pricePerM = priceInput ? priceInput.dataset.numeric || '(harga standar)' : '(harga standar)';
        if (pricePerM !== '(harga standar)') {
            pricePerM = 'Rp ' + parseInt(pricePerM).toLocaleString('id-ID');
        }
        const depth = depthInput ? depthInput.value || '(belum diisi)' : '(belum diisi)';
        const points = pointsInput ? pointsInput.value : '-';
        const total = totalPrice ? totalPrice.textContent : '-';
        const estimasi = estimationTime ? estimationTime.textContent : '-';
        const order = orderInfo ? orderInfo.textContent : '';

        const pesan = 'Halo Agung Perkasa,%0A%0A' +
            'Saya mau tanya soal bore pile diameter 30cm.%0A%0A' +
            'Spesifikasi:%0A' +
            '- Alat: ' + alatName + '%0A' +
            '- Diameter: ' + diameter + ' cm%0A' +
            '- Harga jasa/m: ' + pricePerM + '%0A' +
            '- Kedalaman: ' + depth + ' m%0A' +
            '- Jumlah titik: ' + points + ' titik%0A%0A' +
            'Estimasi total: ' + total + '%0A' +
            'Estimasi waktu: ' + estimasi + '%0A' +
            (order ? order + '%0A' : '') +
            '%0A' +
            'Mohon info penawaran harga dari Agung Perkasa.%0A' +
            'Terima kasih.';

        window.open('https://wa.me/6285710277854?text=' + pesan, '_blank');
    };

    // ===== INIT =====
    currentMethod = 'mesin';
    currentMachine = 'minicrane';
    
    methodBtns.forEach(function(b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
        if (b.dataset.method === 'mesin') {
            b.classList.add('active');
            b.setAttribute('aria-pressed', 'true');
        }
    });

    updateUI();

})();