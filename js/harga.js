// ============================================================
// HARGA.JS - SAMA PERSIS DENGAN BOREPILE-KOTA.JS
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
        80: 0
    };

    const hargaManual = {
        20: 70000,
        25: 75000,
        30: 80000,
        40: 100000
    };

    const hargaSany = {
        30: 0,
        40: 0,
        50: 0,
        60: 0,
        80: 0
    };

    // ===== DIAMETER OPTIONS =====
    const diameterMesin = [30, 40, 50, 60, 80];
    const diameterManual = [20, 25, 30, 40];
    const diameterSany = [30, 40, 50, 60, 80];

    // ===== STATE =====
    let currentMethod = 'mesin';
    let currentMachine = 'minicrane';

    // ===== FUNCTIONS =====
    function formatRupiah(angka) {
        if (isNaN(angka) || angka === 0) return 'Rp 0';
        return 'Rp ' + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
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
        diameterSelect.innerHTML = '';

        options.forEach(function(d) {
            const option = document.createElement('option');
            option.value = d;
            option.textContent = d + ' cm';
            if (d === currentValue && options.includes(currentValue)) {
                option.selected = true;
            }
            diameterSelect.appendChild(option);
        });

        if (!options.includes(currentValue) && options.length > 0) {
            diameterSelect.value = options[0];
        }

        // Reset price input
        if (priceInput) {
            priceInput.value = '';
            priceInput.dataset.numeric = '';
        }

        hitungTotal();
    }

    function getHargaPerMeter(diameter) {
        if (currentMethod === 'manual') {
            return hargaManual[diameter] || 0;
        } else if (currentMachine === 'sany') {
            return hargaSany[diameter] || 0;
        } else {
            return hargaMesin[diameter] || 0;
        }
    }

    function getMinimalOrder() {
        if (currentMethod === 'manual') return 100;
        if (currentMachine === 'sany') return 1200;
        if (currentMachine === 'gawangan') return 150;
        return 200; // mini crane
    }

    function getKecepatanPerHari() {
        if (currentMethod === 'manual') return { min: 2, max: 3 };
        if (currentMachine === 'sany') return { min: 15, max: 25 };
        return { min: 2, max: 4 }; // mini crane & gawangan
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

        // Nama alat
        let alatName = '';
        if (currentMethod === 'manual') {
            alatName = 'Strauss Pile (Manual)';
        } else if (currentMachine === 'sany') {
            alatName = 'SANY Hidrolik';
        } else if (currentMachine === 'gawangan') {
            alatName = 'Gawangan';
        } else {
            alatName = 'Mini Crane';
        }

        // Handling harga 0
        if (hargaPerMeter === 0) {
            if (totalPrice) totalPrice.textContent = 'Hubungi Kami';
            if (detailPrice) detailPrice.textContent = '💬 Konsultasi untuk harga diameter ' + diameter + ' cm';
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

        // Batasi kedalaman
        let depthForCalc = kedalaman;
        let warningMsg = '';
        if (currentMethod === 'manual' && depthForCalc > 10) {
            depthForCalc = 10;
            warningMsg = ' (dibatasi 10m maksimal)';
        }
        if (currentMethod === 'mesin' && currentMachine !== 'sany' && depthForCalc > 30) {
            depthForCalc = 30;
            warningMsg = ' (dibatasi 30m maksimal)';
        }
        if (currentMachine === 'sany' && depthForCalc > 27) {
            depthForCalc = 27;
            warningMsg = ' (dibatasi 27m maksimal)';
        }

        const totalMeter = depthForCalc * jumlahTitik;
        const total = hargaPerMeter * totalMeter;

        if (totalPrice) totalPrice.textContent = formatRupiah(total);

        if (detailPrice) {
            detailPrice.textContent = formatRupiah(hargaPerMeter) + '/m × ' + depthForCalc + 'm × ' + jumlahTitik + ' titik' + warningMsg;
        }

        // Estimasi waktu
        const kecepatan = getKecepatanPerHari();
        const estimasiMin = Math.ceil(totalMeter / kecepatan.max);
        const estimasiMax = Math.ceil(totalMeter / kecepatan.min);

        if (estimationTime) {
            if (totalMeter === 0) {
                estimationTime.textContent = 'Estimasi waktu: -';
            } else if (estimasiMin < 1) {
                estimationTime.textContent = 'Estimasi waktu: 1 hari kerja';
            } else {
                estimationTime.textContent = 'Estimasi waktu: ' + estimasiMin + ' - ' + estimasiMax + ' hari kerja';
            }
        }

        // Minimal order
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
        const row = document.getElementById('machineSelectRow');
        if (row) {
            if (currentMethod === 'mesin') {
                row.style.display = 'grid';
            } else {
                row.style.display = 'none';
            }
        }

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

            if (currentMethod === 'mesin' && machineSelect) {
                currentMachine = 'minicrane';
                machineSelect.value = 'minicrane';
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

    // PRICE INPUT - dengan format Rupiah
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
            this.value = this.value.replace(/[^0-9.]/g, '');
            hitungTotal();
        });
    }

    // POINTS INPUT
    if (pointsInput) {
        pointsInput.addEventListener('input', hitungTotal);
    }

    // ===== SEND TO WA =====
    window.sendToWA = function() {
        let alatName = '';
        if (currentMethod === 'manual') {
            alatName = 'Strauss Pile (Manual)';
        } else if (currentMachine === 'sany') {
            alatName = 'SANY Hidrolik';
        } else if (currentMachine === 'gawangan') {
            alatName = 'Gawangan';
        } else {
            alatName = 'Mini Crane';
        }

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
    if (machineSelect) {
        currentMachine = machineSelect.value || 'minicrane';
    }
    updateUI();

})();