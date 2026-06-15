// ============================================================
// BOREPILE-KOTA.JS - LENGKAP (NAVBAR + JASA SEARCH + KALKULATOR)
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

    // ===== 6. JASA SEARCH & FILTER =====
    const searchInput = document.getElementById('jasaSearch');
    if (searchInput) {
        const filterTags = document.querySelectorAll('.filter-tag');
        const jasaCards = document.querySelectorAll('.jasa-card');
        const resultCount = document.getElementById('resultCount');

        let currentFilter = 'all';
        let currentSearch = '';

        const wilayahMap = {
            'jabodetabek': ['jakarta', 'bekasi', 'tangerang', 'depok', 'bogor'],
            'jawa-barat': ['bandung'],
            'jawa-tengah': ['semarang'],
            'jawa-timur': ['surabaya']
        };

        function filterCards() {
            let visibleCount = 0;
            jasaCards.forEach(function(card) {
                const title = card.querySelector('h3')?.textContent?.toLowerCase() || '';
                const location = card.querySelector('.tag-lokasi')?.textContent?.toLowerCase() || '';
                const fullText = title + ' ' + location;

                let matchFilter = true;
                if (currentFilter !== 'all') {
                    const keywords = wilayahMap[currentFilter] || [];
                    matchFilter = keywords.some(function(keyword) {
                        return fullText.includes(keyword);
                    });
                }

                let matchSearch = true;
                if (currentSearch.trim() !== '') {
                    const searchTerm = currentSearch.toLowerCase().trim();
                    matchSearch = fullText.includes(searchTerm);
                }

                if (matchFilter && matchSearch) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            if (resultCount) {
                if (visibleCount === 0) {
                    resultCount.textContent = '😕 Tidak ada hasil untuk pencarian ini';
                } else {
                    resultCount.textContent = 'Menampilkan ' + visibleCount + ' layanan';
                }
            }
        }

        searchInput.addEventListener('input', function() {
            currentSearch = this.value;
            filterCards();
        });

        filterTags.forEach(function(tag) {
            tag.addEventListener('click', function() {
                filterTags.forEach(function(t) {
                    t.classList.remove('active');
                });
                this.classList.add('active');
                currentFilter = this.dataset.filter;
                filterCards();
            });
        });

        filterCards();
    }

    // ============================================================
    // ===== 7. KALKULATOR BORE PILE =====
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
        40: 400000,
        50: 400000,
        60: 400000,
        80: 400000,
        90: 400000,
        100: 400000,
        110: 400000
    };

    // ===== DIAMETER OPTIONS =====
    const diameterMesin = [30, 40, 50, 60, 80];
    const diameterManual = [20, 25, 30, 40];
    const diameterSany = [40, 50, 60, 80, 90, 100, 110];

    // ===== STATE =====
    let currentMethod = 'mesin';      // 'mesin' | 'manual'
    let currentMachine = 'minicrane'; // 'minicrane' | 'gawangan' | 'sany'

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

        // ✅ FIX 1: Panggil hitungTotal() agar total otomatis update
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
        if (currentMachine === 'sany') return 1200; // Tetap 1200m
        return 200; // mini crane & gawangan
    }

    function getKecepatanPerHari() {
        if (currentMethod === 'manual') return { min: 2, max: 3 };
        return { min: 2, max: 4 }; // mesin semua
    }

    function hitungTotal() {
        if (!diameterSelect || !depthInput || !pointsInput || !totalPrice) {
            return;
        }

        const diameter = parseInt(diameterSelect.value) || 0;
        const kedalaman = parseFloat(depthInput.value) || 0;
        const jumlahTitik = parseInt(pointsInput.value) || 0;
        const hargaManualInput = priceInput ? priceInput.value.replace(/[^0-9]/g, '') : '';
        
        let hargaPerMeter = 0;

        if (hargaManualInput) {
            hargaPerMeter = parseInt(hargaManualInput);
        } else {
            hargaPerMeter = getHargaPerMeter(diameter);
        }

        // TAMPILKAN NAMA ALAT DI ORDER INFO
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

        // ✅ FIX 2: Handling harga 0 → tampilkan "Hubungi Kami"
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

        const total = hargaPerMeter * kedalaman * jumlahTitik;
        if (totalPrice) totalPrice.textContent = formatRupiah(total);

        if (detailPrice) {
            detailPrice.textContent = hargaPerMeter.toLocaleString('id-ID') + '/m × ' + kedalaman + 'm × ' + jumlahTitik + ' titik';
        }

        // ESTIMASI WAKTU
        const totalMeter = kedalaman * jumlahTitik;
        const kecepatan = getKecepatanPerHari();
        const estimasiMin = Math.ceil(totalMeter / kecepatan.max);
        const estimasiMax = Math.ceil(totalMeter / kecepatan.min);

        if (estimationTime) {
            if (estimasiMin < 1) {
                estimationTime.textContent = 'Estimasi waktu: 1 hari kerja';
            } else {
                estimationTime.textContent = 'Estimasi waktu: ' + estimasiMin + ' - ' + estimasiMax + ' hari kerja';
            }
        }

        // ORDER INFO
        const minimalOrder = getMinimalOrder();
        if (orderInfo) {
            if (totalMeter < minimalOrder) {
                orderInfo.textContent = '⚠️ Order di bawah ' + minimalOrder + 'm (' + alatName + '), hubungi admin untuk penawaran khusus atau borongan';
            } else {
                orderInfo.textContent = '✅ Volume order: ' + totalMeter + 'm (' + alatName + ' - cukup)';
            }
        }
    }

    // ===== UPDATE UI SAAT METHOD/MACHINE BERUBAH =====
    function updateUI() {
        // TAMPIL/SEMBUNYIKAN ROW MESIN
        const row = document.getElementById('machineSelectRow');
        if (row) {
            if (currentMethod === 'mesin') {
                row.style.display = 'grid';
            } else {
                row.style.display = 'none';
            }
        }

        // UPDATE DIAMETER OPTIONS
        updateDiameterOptions();

        // RESET PRICE INPUT
        if (priceInput) {
            priceInput.value = '';
        }

        // HITUNG ULANG
        hitungTotal();
    }

    // ===== EVENT LISTENER =====

    // METHOD BTN (Mesin / Manual)
    methodBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            methodBtns.forEach(function(b) {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');
            currentMethod = this.dataset.method;

            // RESET MACHINE KE MINICRANE KALAU PILIH MESIN
            if (currentMethod === 'mesin' && machineSelect) {
                currentMachine = 'minicrane';
                machineSelect.value = 'minicrane';
            }

            updateUI();
        });
    });

    // MACHINE SELECT (Mini Crane, Gawangan, SANY)
    if (machineSelect) {
        machineSelect.addEventListener('change', function() {
            currentMachine = this.value;
            updateUI();
        });
    }

    // DIAMETER SELECT
    if (diameterSelect) {
        diameterSelect.addEventListener('change', hitungTotal);
    }

    // ✅ FIX 3: PRICE INPUT - lebih rapi
    if (priceInput) {
        priceInput.addEventListener('input', function() {
            const val = this.value.replace(/[^0-9]/g, '');
            if (val && parseInt(val) > 0) {
                this.value = 'Rp ' + parseInt(val).toLocaleString('id-ID');
            } else {
                this.value = '';
            }
            hitungTotal();
        });
    }

    // DEPTH INPUT
    if (depthInput) {
        depthInput.addEventListener('input', hitungTotal);
    }

    // POINTS INPUT
    if (pointsInput) {
        pointsInput.addEventListener('input', hitungTotal);
    }

    // ===== 8. SEND TO WA =====
    window.sendToWA = function() {
        const total = document.getElementById('totalPrice');
        const detail = document.getElementById('detailPrice');
        const estimasi = document.getElementById('estimationTime');

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

        const totalText = total ? total.textContent : 'Rp 0';
        const detailText = detail ? detail.textContent : '-';
        const estimasiText = estimasi ? estimasi.textContent : '-';

        const pesan = 'Halo Agung Perkasa,%0A%0A' +
            'Saya mau konsultasi untuk proyek bore pile.%0A%0A' +
            'Alat: ' + alatName + '%0A' +
            'Detail: ' + detailText + '%0A' +
            'Estimasi biaya: ' + totalText + '%0A' +
            'Estimasi waktu: ' + estimasiText + '%0A%0A' +
            'Mohon info lebih lanjut. Terima kasih.';

        const url = 'https://wa.me/6285710277854?text=' + pesan;
        window.open(url, '_blank');
    };

    // ===== 9. INIT =====
    // Set default machine
    if (machineSelect) {
        currentMachine = machineSelect.value || 'minicrane';
    }
    updateUI();

})();